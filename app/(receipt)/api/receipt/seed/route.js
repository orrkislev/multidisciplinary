import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = google('gemini-2.5-flash');
export const maxDuration = 30;

const SeedResponseSchema = z.object({
  chips: z.array(z.string()),
  sliders: z.array(z.object({
    id: z.string(),
    left: z.string(),
    right: z.string()
  })),
  statements: z.array(z.string())
});

export async function POST(req) {
  try {
    const { projectDescription, projectDuration } = await req.json();

    const prompt = `You are helping a student reflect on a completed project. Based on their description, generate initial interactive fragments to help them articulate what they learned and experienced.

Project description: ${projectDescription}
Duration: ${projectDuration}

Generate a JSON response with the following fragment types:

1. "chips": An array of 8-12 skill/concept tags that might be relevant to this project. Be specific to the domain but also include meta-skills (patience, iteration, research, etc.)

2. "sliders": An array of 3-4 spectrum questions relevant to this type of project. Each has a "left" label and "right" label.

3. "statements": An array of 4-5 agree/disagree statements about the process and experience.

Keep everything specific to their project, not generic. Use language from their description.`;

    const result = await generateObject({
      model,
      schema: SeedResponseSchema,
      prompt
    });

    return Response.json(result.object);
  } catch (error) {
    console.error('Error in seed API:', error);
    return Response.json({ error: 'Failed to generate fragments', details: error.message }, { status: 500 });
  }
}
