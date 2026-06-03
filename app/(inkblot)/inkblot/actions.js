'use server'

import { generateObject } from 'ai';
import { models } from '@/lib/ai';
import { rorcharchSchema } from './schema';

const model = models.real;

export async function generateRoles(labels) {
    const prompt = `
    The user is exploring an abstract inkblot. They have identified three core themes (labels):
1. ${labels[0]}
2. ${labels[1]}
3. ${labels[2]}

Synthesize these labels into 3 distinct, grounded roles using the provided JSON schema. Ensure each role represents a completely different professional or philosophical "path."

Role 1: Focus on Structure/Materiality (The "Hard" approach)
Role 2: Focus on Human/Systemic Behavior (The "Soft" approach)
Role 3: Focus on History/Context (The "Temporal" approach)

Rules for the JSON fields:
- title: 1-2 words. An archetype.
- question: A provocative, one-sentence "Hook."
- description: A grounded path for exploration. 2-3 sentences max.
- constraint: A specific "Thou shalt not" that forces creativity.
- obsession: A niche, grounded focus that links the three labels.
`

    const { object } = await generateObject({
        model,
        schema: rorcharchSchema,
        prompt,
        temperature: 0.7,
    });

    return object.roles;
}
