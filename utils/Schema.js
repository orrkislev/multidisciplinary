import { z } from 'zod';

export const namesSchema = z.object({
    subjects: z.array(z.string())
});

export const inkSchema = z.object({
    selected: z.string(),
    years: z.string()
});

