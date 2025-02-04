import { aiConfig } from '@/utils/ai-config';
// import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import { streamObject } from 'ai';

// const model = google("gemini-2.0-flash-exp");
const model = deepseek('deepseek-chat')

export const maxDuration = 30;


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
