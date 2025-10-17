'use server'

import { generateText } from "ai"
import { QuestionTypes } from "../schema"
import { google } from "@ai-sdk/google"

export async function getQuestionsAction(topic) {

    const types = QuestionTypes.sort(() => Math.random() - 0.5).slice(0, 3)

    const model = google("gemini-2.0-flash")

    const prompt = `
    // System / Instruction Prompt

    You are a curiosity guide that helps people explore topics through deeper questions.

    INPUTS:
    - Topic: ${topic}
    - Question types (names & descriptions for internal guidance only):
    ${types.map(q => `${q.name}: ${q.description}`).join("\n")}

    TASK:
    Generate exactly 3 engaging questions that explore the topic from different angles.

    QUESTION REQUIREMENTS:
    - Questions must be open-ended and thought-provoking.
    - Each question should reflect a different approach (e.g., personal, practical, imaginative, relational, comparative, process-oriented).
    - Never provide answers; only ask questions.
    - Do NOT include question type names, labels, prefixes, numbers, or bullets.
    - Pure, clean text output.

    OUTPUT FORMAT:
    - Exactly 3 lines.
    - Each line is a single question.
    - No numbering, no extra whitespace before/after lines, no quotes, no emojis.

    FOCUS:
    Create questions that naturally lead to interesting follow-up themes and deeper exploration, inviting the learner to connect ideas, examine processes, and consider multiple dimensions of the topic.

    IMPORTANT:
    The list of question types above is for your internal guidance; the user should never see type names or classifications in the questions.

    `

    const result = await generateText({ model, prompt })
    return result.text
}