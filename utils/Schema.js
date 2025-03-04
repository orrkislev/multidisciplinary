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
    }),
    canvas: z.object({
        projectDescription: z.string(),
        questions: z.array(
            z.object({
                type: z.enum(['open','multiple','yesno']),
                question: z.string(),
                jsonContent: z.string()
            }),
        ),
        strategies: z.array(
            z.object({
                title: z.string(),
                text: z.string(),
            }),
        ),
    })
}