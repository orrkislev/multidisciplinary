import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { descriptionSchema } from '@/app/(deck)/utils/schema';

const model = google("gemini-2.5-flash");
export const maxDuration = 30;


export async function POST(req) {
    const data = await req.json();

    console.log('description api', data);

    const prompt = `DATA: { ${JSON.stringify(data)} }

ROLE:You are an AI assistant helping students shape the early stage of their projects. Use the provided project description, prior responses, and profile. Do not add information not present in the data.

TASKS: 
1. Analyze: Briefly assess the project’s clarity, scope, and direction. Identify missing or vague elements. 
2. Update Description: Rewrite the project description as a short, clear, objective project summary. Do not mention "the student" or refer to the creator directly; focus only on the project itself. Base it solely on the given content. 
3. Update Profile: Keep or refine "interests", "style", and "goals" if the data supports it. If not supported, leave them as they are. 
4. Completeness: Adjust the "completeness" score between 0.0–1.0, based only on progress in the given responses.

`

    const result = streamObject({ model: model, schema: descriptionSchema, prompt })
    return result.toTextStreamResponse();
}
