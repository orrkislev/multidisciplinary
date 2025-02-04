import { z } from 'zod';

export const vibeSchema = z.object({
    vibe: z.string(),
    themes: z.array(z.string()).length(3),
    quests: z.array(z.object({
        title: z.string(),
        hook: z.object({
            fact: z.string(),
            question: z.string(),
        }),
        path: z.array(z.string()).length(3),
        resources: z.array(z.object({
            type: z.string(),
            title: z.string(),
            url: z.string(),
        })),
        outcome: z.string(),
    })).length(3),
});
