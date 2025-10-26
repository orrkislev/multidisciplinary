import { z } from 'zod';

export const aiSteps = [
    ['name'],
    ['description'],
    ['projects', 'timeline', 'terminology', 'questions'],
]

export const aiConfig = {
    // ---------------------------------------------
    // ----------------- Subjects ------------------
    // ---------------------------------------------
    name: {
        prompt: (data) => `
        GOAL: Create a professional, academic name for the interdisciplinary fusion of ${data.subjects?.join(' and ')}.
        
        THINKING PROCESS:
        1. Analyze core concepts of both fields
        2. Identify linguistic roots/symbols from both domains
        3. Combine elements in novel ways while maintaining academic tone
        
        RULES:
        - Prioritize clarity over cleverness
        - Dont use the original names of the subjects in the resulting name
        - Dont use the words "and" in the resulting name
        - Keep name between 1-4 words`,
        
        schema: z.string(),
    },

    // ---------------------------------------------
    // ----------------- Description ---------------
    // ---------------------------------------------
    description: {
        prompt: ({ subjects, name }) => `
          GOAL: Create engaging description for ${name} (${subjects?.join(' and ')} fusion)
          
          THINKING PROCESS:
          1. Create intriguing hook
          2. Explain why this combination matters now
          3. Identify surprising synergies
          4. Add memorable fun fact
          
          RULES:
          - Subtitle ≤ 12 words
          - Use active voice
          - Avoid comparative language ("better than")
          - Fun fact should be verifiable
          
          EXAMPLE STRUCTURE:
          "[Title]: [Subtitle]
          [Paragraph 1: Core concept]
          [Paragraph 2: Real-world application]
          Fun Fact: [Surprising insight]"`,
        schema: z.object({
            title: z.string(),
            subtitle: z.string(),
            description: z.string(),
            funFact: z.string(),
            emergingTrends: z.array(z.string())
        }),
    },

    // ---------------------------------------------
    // ----------------- Projects ------------------
    // ---------------------------------------------
    projects: {
        prompt: ({ subjects, name, description }) => `
          Based on the following description of ${name} (a fusion between ${subjects?.join(' and ')}): "${description.description}". 
          Create 4 projects of different levels:
          
          RULES:
          - Required knowledge from both fields
          - Unexpected material combinations`,
        schema: z.array(z.object({
            name: z.string(),
            description: z.string(),
            crossDisciplinarySkills: z.string(),
        })),
    },

    // ---------------------------------------------
    // ----------------- Timeline ------------------
    // ---------------------------------------------
    timeline: {
        prompt: ({ subjects, name, description }) => `
        Based on the following description of ${name} (a fusion between ${subjects?.join(' and ')}): "${description.description}". 
        Create a timeline with:
        1. 3 Past milestones (pre-2010)
        2. 2 Current developments (2020s)
        3. 1 Future projection (2030+)
        Include surprising real-world connections`,
        schema: z.object({
            past: z.array(z.object({
                year: z.number(),
                event: z.string(),
                influence: z.string()
            })),
            present: z.array(z.object({
                project: z.string(),
                organization: z.string()
            })),
            future: z.object({
                year: z.number(),
                scenario: z.string(),
                probability: z.string()
            })
        }),
    },

    // ---------------------------------------------
    // ----------------- Terminology ---------------
    // ---------------------------------------------
    terminology: {
        prompt: ({ subjects, name, description }) => `
            Based on the following description of ${name} (a fusion between ${subjects?.join(' and ')}): "${description.description}". 
            Create a concise vocabulary list of key terms specific to this field. 
            Include fundamental concepts, important methodologies, and relevant technical terms.
            Provide clear, beginner-friendly definitions that help understand the core concepts of this interdisciplinary field.`,
        schema: z.object({
            concepts: z.array(z.object({
                term: z.string(),
                definition: z.string(),
                example: z.string()
            })),
            methodologies: z.array(z.object({
                term: z.string(),
                process: z.string(),
            })),
            technicalTerms: z.array(z.object({
                term: z.string(),
                definition: z.string()
            }))
        }),
    },

    // ---------------------------------------------
    // ----------------- Questions -----------------
    // ---------------------------------------------
    questions: {
        prompt: ({ name, description }) => `
      Based on this description about ${name} : "${description.description}",
      Generate 7 thought-provoking questions:
      - 3 Conceptual framework questions
      - 2 Ethical dilemma questions
      - 2 Future implication questions
      Phrase as open-ended discussions`,
        schema: z.object({
            conceptual: z.array(z.string()),
            ethical: z.array(z.string()),
            futuristic: z.array(z.string())
        }),
    },
};
