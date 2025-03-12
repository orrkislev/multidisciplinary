import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;
const model = google("gemini-2.0-flash");

export async function POST(req) {
  const {prompt} = await req.json();
  const result = streamText({ model, prompt });
  return result.toTextStreamResponse();
}