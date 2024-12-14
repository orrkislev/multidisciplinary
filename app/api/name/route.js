import { descriptionSchema, namesSchema, projectsSchema } from '@/utils/AiData';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';

export const maxDuration = 30;
const model = google("gemini-2.0-flash-exp");

export async function POST(req) {
  const data = await req.json();

  let prompt = '';
  let schema = null;

  if (data.action == 'name') {
    schema = namesSchema
    prompt = `Come up with names for the topic of interest that is the fusion between ${data.subject1} and ${data.subject2}. `
    prompt += 'The names should be academic and professional, short and creative. ';

  } else if (data.action == 'description') {
    schema = descriptionSchema;
    prompt = `write a brief wikipedia-like description about ${data.name}. (the fusion between ${data.subject1} and ${data.subject2}). `;
    prompt += 'The subtile should be intriguing and the description should be professional, short, and easy to understand. ';

  } else if (data.action == 'projects') {
    schema = projectsSchema;
    prompt = `List some beginner level projects that can be done in the field of ${data.name} (the fusion between ${data.subject1} and ${data.subject2}). `;
    prompt += 'The projects should be simple, easy to understand, and beginner friendly. ';
  }

  const result = streamObject({ model, schema, prompt });
  return result.toTextStreamResponse();
}