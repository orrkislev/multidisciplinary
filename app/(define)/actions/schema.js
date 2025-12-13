import { z } from 'zod';

const InsertionSchema = z.object({
    type: z.literal('insertion'),
    position: z.number().describe('Insert after this word index'),
    options: z.array(z.string()).min(1).max(4).describe('Possible insertions, from simple prompts to full phrases'),
});

const QuestionSchema = z.object({
    type: z.literal('question'),
    wordStart: z.number().describe('Start of the phrase to question'),
    wordEnd: z.number().describe('End of the phrase to question (inclusive)'),
    options: z.array(z.string()).min(1).max(3).describe('Genuine questions about this phrase'),
});

const ReplacementSchema = z.object({
    type: z.literal('replacement'),
    wordStart: z.number().describe('Start of the phrase to replace'),
    wordEnd: z.number().describe('End of the phrase to replace (inclusive)'),
    options: z.array(z.string()).min(2).max(5).describe('Alternative words or phrases, ranging from precise to surprising'),
});

const InterventionSchema = z.discriminatedUnion('type', [
    InsertionSchema,
    QuestionSchema,
    ReplacementSchema,
]);

export const ClaimResponseSchema = z.object({
    interventions: z.array(InterventionSchema).min(0).max(4).describe('2-4 interventions, mixed types, spread across the text'),
});