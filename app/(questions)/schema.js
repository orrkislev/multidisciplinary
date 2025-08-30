import { z } from "zod";

export const QuestionTypes = [
    {name: "clarifier", description: "A question that clarifies the user's understanding of a concept"},
    {name: "socratic", description: "A question that asks the user to consider a concept in a new way"},
    {name: "what_if", description: "A question that asks the user to consider a hypothetical scenario"},
    {name: "personal", description: "A question that asks the user to reflect on their own experiences"},
    {name: "opposite", description: "A question that asks the user to consider the opposite of a concept"},
    {name: "connection", description: "A question that asks the user to connect two concepts"},
]

export const TopicSchema = z.object({
    theme: z.string().describe("A theme that is a natural extension of the current theme and the question the user just selected"),
    questions: z.array(z.string()).describe("A list of questions to ask the user, in hebrew only"),
});

export const ThemeResponseSchema = z.object({
    theme: z.string().describe("A theme that is a natural extension of the current theme and the question the user just selected"),
});

export const InitialSchema = z.object({
    questions: z.array(z.string()).describe("A list of questions to ask the user, in hebrew only"),
});

export const SourcesSchema = z.object({
    overview: z.string().describe("An overview of the topic"),
    who: z.array(z.string()).describe("A list of who else is working with this topic"),
    where: z.array(z.string()).describe("A list of where to learn more about this topic"),
});