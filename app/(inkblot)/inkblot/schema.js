import { z } from 'zod';

export const rorcharchSchema = z.object({
    roles: z.array(z.object({
        title: z.string(),
        question: z.string(),
        description: z.string(),
        constraint: z.string(),
        obsession: z.string(),
        readFirst: z.string(),
        digInto: z.string(),
    })).length(3),
});