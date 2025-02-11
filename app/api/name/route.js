import { aiConfig } from '@/utils/ai-config';
import { aiSchemas } from '@/utils/Schema';
// import { google } from '@ai-sdk/google';
// import { deepseek } from '@ai-sdk/deepseek';
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';

// const model = google("gemini-2.0-flash");
// const model = deepseek('deepseek-chat')
const model = openai('gpt-4o-mini-2024-07-18');

export const maxDuration = 30;


export async function POST(req) {
  const data = await req.json();

  const prompt = data.prompt
  const key = data.key
  const schema = aiConfig[key]?.schema || aiSchemas[key];

  if (!prompt || !schema) {
    return { status: 400, body: 'Invalid action' };
  }

  const result = streamObject({ model, schema, prompt})
  return result.toTextStreamResponse();
}
