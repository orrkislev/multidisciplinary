import { streamObject } from 'ai';
import { models } from '@/lib/ai';
import { fusionPrompt, fusionSchema } from '../../fusion';

export const maxDuration = 60;

export async function POST(req) {
    const { subjects } = await req.json();
    const valid = Array.isArray(subjects) && subjects.length === 2
        && subjects.every(s => typeof s === 'string' && s.trim() && s.length <= 80);
    if (!valid) return Response.json({ error: 'Send two subjects, each up to 80 characters.' }, { status: 400 });

    const result = streamObject({ model: models.real, schema: fusionSchema, prompt: fusionPrompt(subjects.map(s => s.trim())) });
    return result.toTextStreamResponse();
}
