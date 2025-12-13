import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = google('gemini-2.5-flash');
export const maxDuration = 30;

const CompleteResponseSchema = z.object({
    total: z.string(),
    coupon: z.string()
});

export async function POST(req) {
    try {
        const { responses, receipt } = await req.json();

        const prompt = `Based on everything the user has shared, generate the final receipt elements:

All responses: ${JSON.stringify(responses, null, 2)}
Current receipt: ${JSON.stringify(receipt, null, 2)}

Generate:
1. "total": A playful, specific summary line for the bottom of the receipt. Reference their actual project.
2. "coupon": A "discount" they've earned for next time — something they learned that will make future projects easier. Frame it as "X% off [something]" or "Free [something] next time"

Keep the tone warm but not cheesy. Match the receipt aesthetic — bureaucratic yet personal.`;

        const result = await generateObject({
            model,
            schema: CompleteResponseSchema,
            prompt
        });

        return Response.json(result.object);
    } catch (error) {
        console.error('Error in complete API:', error);
        return Response.json({ error: 'Failed to complete receipt', details: error.message }, { status: 500 });
    }
}
