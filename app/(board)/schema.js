import { z } from 'zod';

export const boardSchema = z.object({
    questions: z.array(z.string()).describe("List of questions"),
    lists: z.array(
        z.object({
            id: z.number().describe("List ID"),
            description: z.string().describe("List description"),
            suggestions: z.array(z.string()).describe("List of suggestions")
        }).describe("List of lists")
    ),
    newListName: z.string().describe("Suggested name of a new list"),
}).strict()