import { aiConfig } from '@/app/(interdisciplinary)/utils/ai-config';
import { aiSchemas } from '@/utils/Schema';
import { models } from '@/lib/ai';
import { streamObject } from 'ai';

const model = models.real;
export const maxDuration = 30;


export async function POST(req) {
  const data = await req.json();

  const prompt = data.prompt
  const key = data.key
  const schema = aiConfig[key]?.schema || aiSchemas[key];

  if (!prompt || !schema) {
    return { status: 400, body: 'Invalid action' };
  }

  const result = streamObject({ model, schema, prompt })
  return result.toTextStreamResponse();
}
