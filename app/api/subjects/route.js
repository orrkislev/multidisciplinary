import { namesSchema } from '@/utils/Schema';
import { groq } from '@ai-sdk/groq';
import { streamObject } from 'ai';

export const maxDuration = 30;
const model = groq('gemma2-9b-it');


export async function POST(req) {
  const data = await req.json();

  let prompt = `list subjects or topics of interest related to '${data.input}'. `;
  prompt += 'The list should be academic and professional sounding, just one or two words each. ';

  const result = streamObject({ model, schema: namesSchema, prompt });
  return result.toTextStreamResponse();
}