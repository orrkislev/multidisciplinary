import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = google('gemini-2.5-flash');
export const maxDuration = 30;

const GenerateResponseSchema = z.object({
    fillins: z.array(z.string()),
    chips: z.array(z.string())
});

export async function POST(req) {
    try {
        const { responses } = await req.json();

        const prompt = `Based on the user's project and their responses so far, generate more specific fragments and suggest receipt line items.

User responses so far:
${JSON.stringify(responses, null, 2)}

Generate:
1. "fillins": 2-3 fill-in-the-blank prompts that dig deeper into what they've indicated.
2. "chips": 3-5 more specific skills/concepts based on their responses.

Be specific. Reference their actual project. Don't repeat what's already been covered.`;

        const result = await generateObject({
            model,
            schema: GenerateResponseSchema,
            prompt
        });

        return Response.json(result.object);
    } catch (error) {
        console.error('Error in generate API:', error);
        return Response.json({ error: 'Failed to generate more fragments', details: error.message }, { status: 500 });
    }
}
