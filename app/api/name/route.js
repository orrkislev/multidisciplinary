import { aiConfig } from '@/utils/ai-config';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';

export const maxDuration = 30;
const model = google("gemini-2.0-flash-exp");

export async function POST(req) {
  const data = await req.json();

  const prompt = data.prompt
  const key = data.key
  const schema = aiConfig[key].schema

  if (!prompt || !schema) {
    return { status: 400, body: 'Invalid action' };
  }

  const result = streamObject({ model, schema, prompt})
  return result.toTextStreamResponse();
}
