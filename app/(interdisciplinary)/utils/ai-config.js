import { z } from 'zod';
import { create } from 'zustand';

export const createAiStore = (initial, transform = data => data) => create((set, get) => ({
    data: initial,
    setData: (data) => set({ data: transform(data) }),
}));

export const useUserData = create((set) => ({
    subject1: null,
    subject2: null,
    setSubjects: (subject1, subject2) => set({ subject1, subject2 }),
    proficiency: null,
    setProficiency: (level) => set({ proficiency: level }),
}));

export const aiConfig = {
    // ---------------------------------------------
    // ----------------- Subjects ------------------
    // ---------------------------------------------
    names: {
        dependencies: ['subject1', 'subject2'],
        prompt: ({ subject1, subject2 }) => `
        GOAL: Create 5-7 professional names for the interdisciplinary fusion of ${subject1} and ${subject2}.
        
        THINKING PROCESS:
        1. Analyze core concepts of both fields
        2. Identify linguistic roots/symbols from both domains
        3. Combine elements in novel ways while maintaining academic tone
        
        RULES:
        - Prioritize clarity over cleverness
        - Avoid jargon from either discipline
        - Keep names between 1-4 words
        - No obscure mythology references
        
        FORMAT: Array of names sorted by creativity`,
        schema: z.object({
            names: z.array(z.string().max(4)).length(7),
            rationale: z.string().describe("Brief explanation of naming approach")
        }),
        store: createAiStore(),
    },

    // ---------------------------------------------
    // ----------------- Description ---------------
    // ---------------------------------------------
    description: {
        dependencies: ['subject1', 'subject2', 'names'],
        prompt: ({ subject1, subject2, names }) => `
          GOAL: Create engaging description for ${names[0]} (${subject1} × ${subject2} fusion)
          
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
            subtitle: z.string().max(12),
            description: z.string().max(500),
            funFact: z.string().max(100),
            emergingTrends: z.array(z.string()).length(3)
        }),
        store: createAiStore(),
    },

    // ---------------------------------------------
    // ----------------- Assessment ----------------
    // ---------------------------------------------
    // literacyAssessment: {
    //     dependencies: ['subject1', 'subject2'],
    //     prompt: ({ subject1, subject2 }) => `
    //       Create 5-question quiz assessing basic literacy in both ${subject1} and ${subject2}.
          
    //       GUIDELINES:
    //       - 2 questions about ${subject1} fundamentals
    //       - 2 questions about ${subject2} basics
    //       - 1 question about their potential intersection
    //       - Mix of factual and conceptual questions
    //       - Clear correct answers with brief explanations`,
    //     schema: z.object({
    //         questions: z.array(z.object({
    //             question: z.string(),
    //             options: z.array(z.string()).length(4),
    //             answer: z.string(),
    //             explanation: z.string().max(100)
    //         })).length(5),
    //     }),
    //     store: createAiStore(),
    //     calculateProficiency: (answers) => {
    //         let correctAnswers = answers.filter(answer => answer.isCorrect).length;
    //         if (correctAnswers <= 2) return 'novice';
    //         if (correctAnswers <= 4) return 'intermediate';
    //         return 'expert';
    //     },
    // },

    // ---------------------------------------------
    // ----------------- Projects ------------------
    // ---------------------------------------------
    projects: {
        dependencies: ['subject1', 'subject2', 'names', 'description'],
        prompt: ({ subject1, subject2, names, description }) => `
          Based on the following description of ${names[0]} (a fusion between ${subject1} and ${subject2}): "${description.description}". 
          Create 4 projects of different levels:
          
          RULES:
          - Required knowledge from both fields
          - Unexpected material combinations`,
        schema: z.array(z.object({
            name: z.string(),
            description: z.string(),
            crossDisciplinarySkills: z.string(),
        })).length(4),
        store: createAiStore(),
    },

    // ---------------------------------------------
    // ----------------- Timeline ------------------
    // ---------------------------------------------
    timeline: {
        dependencies: ['subject1', 'subject2', 'names', 'description'],
        prompt: ({ subject1, subject2, names, description }) => `
        Based on the following description of ${names[0]} (a fusion between ${subject1} and ${subject2}): "${description.description}". 
        Create a timeline with:
        1. 3 Past milestones (pre-2010)
        2. 2 Current developments (2020s)
        3. 1 Future projection (2030+)
        Include surprising real-world connections`,
        schema: z.object({
            past: z.array(z.object({
                year: z.number(),
                event: z.string().max(100),
                influence: z.string().max(50)
            })).length(3),
            present: z.array(z.object({
                project: z.string(),
                organization: z.string()
            })).length(2),
            future: z.object({
                year: z.number().min(2030),
                scenario: z.string(),
                probability: z.enum(['likely', 'speculative', 'visionary'])
            })
        }),
        store: createAiStore(),
    },

    // ---------------------------------------------
    // ----------------- Terminology ---------------
    // ---------------------------------------------
    terminology: {
        dependencies: ['subject1', 'subject2', 'names', 'description'],
        prompt: ({ subject1, subject2, names, description }) => `
            Based on the following description of ${names[0]} (a fusion between ${subject1} and ${subject2}): "${description.description}". 
            Create a concise vocabulary list of key terms specific to this field. 
            Include fundamental concepts, important methodologies, and relevant technical terms.
            Provide clear, beginner-friendly definitions that help understand the core concepts of this interdisciplinary field.`,
        schema: z.object({
            concepts: z.array(z.object({
                term: z.string(),
                definition: z.string().max(100),
                example: z.string().max(50)
            })),
            methodologies: z.array(z.object({
                name: z.string(),
                process: z.string().max(100),
                icon: z.enum(['🔬', '⚙️', '📊'])
            })),
            technicalTerms: z.array(z.object({
                term: z.string(),
                definition: z.string().max(100)
            }))
        }),
        store: createAiStore(),
    },

    // ---------------------------------------------
    // ----------------- Questions -----------------
    // ---------------------------------------------
    questions: {
        dependencies: ['names', 'description', 'terminology'],
        prompt: ({ names, description }) => `
      Based on this description about ${names[0]} : "${description.description}",
      Generate 7 thought-provoking questions:
      - 3 Conceptual framework questions
      - 2 Ethical dilemma questions
      - 2 Future implication questions
      Phrase as open-ended discussions`,
        schema: z.object({
            conceptual: z.array(z.string()).length(3),
            ethical: z.array(z.string()).length(2),
            futuristic: z.array(z.string()).length(2)
        }),
        store: createAiStore(),
    },
};
