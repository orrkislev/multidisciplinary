import { z } from 'zod';

export const namesSchema = z.object({
    subjects: z.array(z.string())
});

export const aiSchemas = {
    names: namesSchema,
    character: z.object({
        name: z.string(),
        title: z.string(),
        year: z.number(),
        description: z.string(),
        challenge: z.string(),
        scenario: z.string(),
        physical: z.string(),
    }),
    chat: z.object({
        text: z.string(),
        understanding: z.number(),
    }),
    ideator: z.object({
        questions: z.array(z.string()).min(1),
        strategies: z.array(
            z.object({
                title: z.string(),
                task: z.string(),
            }),
        )
    })
}