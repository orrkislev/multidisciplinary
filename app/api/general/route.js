import { models } from '@/lib/ai';
import { streamText } from 'ai';

export const maxDuration = 30;
const model = models.real;

export async function POST(req) {
  const { prompt } = await req.json();
  const result = streamText({ model, prompt });
  return result.toTextStreamResponse();
}