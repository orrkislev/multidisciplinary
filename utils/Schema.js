import { z } from 'zod';

export const namesSchema = z.object({
    subjects: z.array(z.string())
});

export const descriptionSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    funFact: z.string(),
});

export const projectsSchema = z.object({
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        emoji: z.string()
    }))
});

export const terminologySchema = z.object({
    concepts: z.array(z.object({
        name: z.string(),
        definition: z.string()
    })),
    methodologies: z.array(z.object({
        name: z.string(),
        definition: z.string()
    })),
    technicalTerms: z.array(z.object({
        name: z.string(),
        definition: z.string()
    })),
});