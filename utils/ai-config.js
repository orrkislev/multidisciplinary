import { z } from 'zod';
import { create } from 'zustand';

const createAiStore = (transform = data => data) => create((set, get) => ({
    data: null,
    setData: (data) => set({ data: transform(data) }),
}));

export const aiConfig = {
    names: {
        prompt: ({ subject1, subject2 }) =>
            `Come up with names for the topic of interest that is the fusion between ${subject1} and ${subject2}. The names should be academic and professional, short and creative.`,
        schema: z.object({
            subjects: z.array(z.string())
        }),
        dependencies: [],
        store: createAiStore(data => data?.subjects)
    },
    description: {
        prompt: ({ subject1, subject2, name }) =>
            `write a brief wikipedia-like description about ${name} (the fusion between ${subject1} and ${subject2}). The subtile should be intriguing and the description should be professional, short, and easy to understand. Include a fun fact about the topic.`,
        schema: z.object({
            title: z.string(),
            subtitle: z.string(),
            description: z.string(),
            funFact: z.string(),
        }),
        dependencies: ['names'],
        store: createAiStore()
    },
    projects: {
        prompt: ({ subject1, subject2, name }) =>
            `List some beginner level projects that can be done in the field of ${name} (the fusion between ${subject1} and ${subject2}). The projects should be simple, easy to understand, and beginner friendly.`,
        schema: z.object({
            projects: z.array(z.object({
                name: z.string(),
                description: z.string(),
                emoji: z.string()
            }))
        }),
        dependencies: ['names'],
        store: createAiStore(data => data?.projects)
    },
    terminology: {
        prompt: ({ subject1, subject2, name, description }) =>
            `Based on the following description of ${name} (a fusion between ${subject1} and ${subject2}): "${description.description}". Create a concise vocabulary list of key terms specific to this field. Include fundamental concepts, important methodologies, and relevant technical terms. Provide clear, beginner-friendly definitions that help understand the core concepts of this interdisciplinary field.`,
        schema: z.object({
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
        }),
        dependencies: ['names', 'description'],
        store: createAiStore()
    },
    questions: {
        name: 'questions',
        prompt: ({ subject1, subject2, name, description }) =>
            `Based on the following description of ${name} (a fusion between ${subject1} and ${subject2}): "${description.description}". Create a list of follow-up questions that can be asked to further understand the topic. The questions should be thought-provoking, engaging, and should help the reader dive deeper into the subject matter.`,
        schema: z.object({
            questions: z.array(z.string())
        }),
        dependencies: ['names', 'description'],
        store: createAiStore(data => data?.questions)
    },
    quiz: {
        prompt: ({ subject1, subject2, name, description, terminology }) =>
            `Based on the following description of ${name} (a fusion between ${subject1} and ${subject2}): "${description.description}", and the key terms provided: "${terminology.concepts.map(c => c.name).join(', ')}".
             Create a quiz that tests the reader's knowledge on the topic. The quiz should be engaging, informative, and should cover key concepts discussed in the description.`,
        schema: z.array(z.object({
            question: z.string(),
            options: z.array(z.string()),
            answer: z.string()
        })),
        dependencies: ['names', 'description', 'terminology'],
        store: createAiStore()
    }
};