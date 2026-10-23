import { z } from 'zod';

export const fusionKey = (a, b) => `${a}|${b}`.toLowerCase();

const term = z.object({
    term: z.string(),
    definition: z.string().describe('at most 18 words, beginner friendly'),
});

// Field order is stream order: the article fills in top to bottom.
export const fusionSchema = z.object({
    name: z.string().describe('1-3 words, a coined name for the discipline'),
    subtitle: z.string().describe('one-line definition, at most 10 words'),
    notes: z.string().describe('private planning, never shown: the real person, the five real historical events and the true fun fact you will use, each one you are sure of. Under 80 words'),
    lead: z.string().describe('two short paragraphs separated by a blank line, about 80 words in total, key terms wrapped in [[double brackets]]'),
    didYouKnow: z.string().describe('one real, verifiable, surprising fact that already links the two parent subjects, at most 30 words'),
    infobox: z.object({
        keyFigure: z.string().describe('a REAL person from either parent field whose work this discipline would claim as its ancestor: name, then a few words on why'),
        methods: z.array(z.string()).describe('3 core methods, 2-4 words each'),
        lookUp: z.array(z.string()).describe('3 real, existing fields, works, phenomena or people adjacent to this fusion that are worth searching for — not the key terms, 1-4 words each'),
    }),
    figure: z.object({
        prompt: z.string().describe('one concrete thing to draw as a plate: an apparatus, specimen or diagram of this field. Visual description only'),
        caption: z.string().describe('caption for that plate, at most 10 words'),
    }),
    history: z.array(z.object({
        year: z.number(),
        event: z.string().describe('at most 18 words'),
    })).describe('5 REAL events, chronological'),
    terms: z.object({
        concepts: z.array(term).describe('2 fundamental concepts'),
        methods: z.array(term).describe('2 methods: how practitioners work'),
        technical: z.array(term).describe('2 technical terms, tools or units'),
    }).describe('every [[term]] used in the lead must appear here, spelled the same'),
    questions: z.object({
        conceptual: z.string().describe('a question about what the field is or how it works, at most 20 words'),
        ethical: z.string().describe('an ethical dilemma the field raises, at most 20 words'),
        future: z.string().describe('a question about where the field could go, at most 20 words'),
    }),
    projects: z.array(z.object({
        scale: z.enum(['An afternoon', 'A weekend', 'A season']),
        name: z.string(),
        description: z.string().describe('at most 25 words, concrete materials and steps'),
    })).describe('3 projects: one of each scale, in that order'),
    seeAlso: z.array(z.object({
        a: z.string().describe('a subject, 1-3 words'),
        b: z.string().describe('a subject, 1-3 words'),
        name: z.string().describe('the coined name of that fusion'),
    })).describe('3 neighbouring fusions, each keeping one parent subject and swapping the other for a nearby one'),
});

export const fusionPrompt = ([a, b]) => `You write entries for an encyclopedia of disciplines that do not exist yet. The point is to make the reader curious enough to go and learn about ${a} and ${b} for real.

Invent the discipline that would exist if ${a} and ${b} had grown up together, and write its entry.

How to write it:
- Short and to the point. Every sentence should carry a concrete idea; cut anything that only sounds good.
- Name it the way a real department would be named: a coined word, a borrowed term or a short phrase. Do not reuse "${a}" or "${b}" verbatim.
- Say what practitioners physically do: tools, places, materials, what a good result looks like. Specific nouns, not abstractions.
- Never write "explores the intersection of", "bridges the gap", "synergy", "innovative", "cutting-edge" or "in today's world".
- The lead: first paragraph says what the field does, second names the tension between its parents. Wrap 3-5 key terms in [[double brackets]].
- Everything presented as fact must be true: the key figure is a real person, the history is five real events from ${a} or ${b} that, in hindsight, prepared the ground (correct years, real people and places), the fun fact is checkable, and the "look up" topics really exist. If you are unsure of something, pick something else you are sure of.
- Questions should be specific enough that two practitioners could disagree.
- Projects should be doable by a curious amateur, with real materials.
- Plain language, as if for a smart 16-year-old.`;
