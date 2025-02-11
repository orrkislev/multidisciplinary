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
    }),
    chat: z.object({
        text: z.string(),
        understanding: z.number(),
    })
}