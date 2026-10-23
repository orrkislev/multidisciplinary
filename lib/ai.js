import { createAnthropic } from '@ai-sdk/anthropic';
import { wrapLanguageModel } from 'ai';

// Update model names here to change them globally across all API routes.
// Three tiers: faster (cheap/quick tasks), real (standard generation), deeper (complex reasoning)

// AI SDK v4 speaks an older Claude dialect: it always sends `temperature` (rejected by current
// models), forces a tool call for JSON output (rejected by Sonnet 5.5), caps output at 4096 tokens
// and can't turn thinking off. Translate all of it here so every route keeps using
// generateObject/streamObject unchanged.
// ponytail: drop this once the project moves to AI SDK v5+ or the Anthropic SDK.
// Strict schemas reject size/range limits; the shape is still enforced, the limits stay in descriptions
const UNSUPPORTED = ['minItems', 'maxItems', 'minLength', 'maxLength', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf', 'pattern'];
const strictSafe = (node) => {
  if (Array.isArray(node)) return node.map(strictSafe);
  if (!node || typeof node !== 'object') return node;
  return Object.fromEntries(Object.entries(node).filter(([k]) => !UNSUPPORTED.includes(k)).map(([k, v]) => [k, strictSafe(v)]));
};

const anthropic = createAnthropic({
  fetch: (url, init) => {
    const body = JSON.parse(init.body);
    // Haiku thinks by default; these experiments want speed, and thinking eats the output budget
    if (body.model.includes('haiku')) body.thinking = { type: 'disabled' };
    // strict: the JSON always matches the schema. eager: stream it as it's written instead of buffering
    if (body.tools) body.tools = body.tools.map(t => (t.input_schema ? { ...t, input_schema: strictSafe(t.input_schema), strict: true, eager_input_streaming: true } : t));
    return fetch(url, { ...init, body: JSON.stringify(body) });
  },
});

const claudeCompat = {
  transformParams: async ({ params }) => {
    const p = { ...params, temperature: undefined, topP: undefined, topK: undefined, maxTokens: params.maxTokens ?? 16000 };
    if (p.mode?.type === 'object-tool') {
      const tool = p.mode.tool;
      p.mode = { type: 'regular', tools: [tool], toolChoice: { type: 'auto' } };
      p.prompt = [{ role: 'system', content: `Respond only by calling the ${tool.name} tool.` }, ...p.prompt];
    }
    return p;
  },
};

const claude = (id) => wrapLanguageModel({ model: anthropic(id), middleware: claudeCompat });

export const models = {
  faster: claude('claude-haiku-5-5'),   // fast, cheap — naming, tagging, simple lists
  real: claude('claude-haiku-5-5'),     // standard work — most generation tasks
  deeper: claude('claude-sonnet-5-5'),  // heavier reasoning — complex or long-form tasks
};
