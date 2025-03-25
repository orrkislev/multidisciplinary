import { z } from 'zod';

export const descriptionSchema = z.object({
  analysis: z.string().describe("Analysis text"),
  description: z.string().describe("Updated project description"),
  profile: z.object({
    interests: z.string().describe("User interests"),
    style: z.string().describe("User style"), 
    goals: z.string().describe("User goals"),
    completeness: z.number()
      .min(0)
      .max(1)
      .describe("How complete the profile is")
  })
}).strict()


export const cardSchema = z.object({
  analysis: z.string().describe("Analysis text"),
  card_suggestions: z.array(
    z.object({
      type: z.enum([
        "question",
        "goal", 
        "wild",
        "idea",
        "research",
        "inspiration", 
        "reflection",
        "challenge"
      ]).describe("Suggestion type"),
      content: z.string().describe("Suggestion content"),
      content2: z.string().describe("Additional suggestion content"), 
      imagePrompt: z.string().describe("Image prompt")
    })
  )
}).strict()
