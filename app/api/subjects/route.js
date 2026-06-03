import { namesSchema } from '@/utils/Schema';
import { models } from '@/lib/ai';
import { streamObject } from 'ai';

export const maxDuration = 30;
const model = models.faster;

export async function POST(req) {
  const data = await req.json();

  let prompt = `list subjects or topics of interest related to '${data.input}'. `;
  prompt += 'The list should be academic and professional sounding, just one or two words each. ';

  const result = streamObject({ model, schema: namesSchema, prompt });
  return result.toTextStreamResponse();
}
