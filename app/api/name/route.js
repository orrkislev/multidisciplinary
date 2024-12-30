import { descriptionSchema, namesSchema, projectsSchema, terminologySchema } from '@/utils/Schema';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';

export const maxDuration = 30;
const model = google("gemini-2.0-flash-exp");

export async function POST(req) {
  const data = await req.json();

  let prompt = '';
  let schema = null;

  console.log('AI request', data.action)

  if (data.action == 'name') {
    schema = namesSchema
    prompt = `Come up with names for the topic of interest that is the fusion between ${data.subject1} and ${data.subject2}. `
    prompt += 'The names should be academic and professional, short and creative. ';

  } else if (data.action == 'description') {
    schema = descriptionSchema;
    prompt = `write a brief wikipedia-like description about ${data.name}. (the fusion between ${data.subject1} and ${data.subject2}). `;
    prompt += 'The subtile should be intriguing and the description should be professional, short, and easy to understand. ';
    prompt += 'Include a fun fact about the topic. ';

  } else if (data.action == 'projects') {
    schema = projectsSchema;
    prompt = `List some beginner level projects that can be done in the field of ${data.name} (the fusion between ${data.subject1} and ${data.subject2}). `;
    prompt += 'The projects should be simple, easy to understand, and beginner friendly. ';
  } else if (data.action == 'terms') {
    schema = terminologySchema;
    prompt = `Based on the following description of ${data.name} (a fusion between ${data.subject1} and ${data.subject2}): "${data.description}" .`
    prompt += 'Create a concise vocabulary list of key terms specific to this field. Include fundamental concepts, important methodologies, and relevant technical terms. Provide clear, beginner-friendly definitions that help understand the core concepts of this interdisciplinary field.'
  } else {
    return { status: 400, body: 'Invalid action' }
  }

  const result = streamObject({ model, schema, prompt });
  return result.toTextStreamResponse();
}