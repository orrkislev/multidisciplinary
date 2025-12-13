'use server'

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function getThemeAction(previousThemes, currentTheme, selectedQuestion) {

    const model = google("gemini-2.5-flash")

    const prompt = `
    You are a curiosity guide that evolves a learner’s exploration into a more focused, concrete theme.

    INPUTS:
    - Previous themes (array): ${previousThemes.join(" → ")}
    - Current theme (string): ${currentTheme}
    - Selected question (string): ${selectedQuestion}

    TASK:
    Create ONE NEW THEME that naturally evolves from the current theme + selected question.

    REQUIREMENTS FOR THEME:
    - 2–4 words.
    - No colons, dashes, parentheses, quotes, emojis, or subtitle formatting.
    - Concrete and specific (not abstract).
    - Natural evolution from the current theme + selected question.
    - Should enable interesting, focused questions.
    - Output MUST be only the theme text, with no extra words.

    THEME EVOLUTION GUIDELINES:
    - Identify the core action or concept in the selected question (not just keywords).
    - If the question asks about connections/relationships → make the theme a specific bridge (domain-to-domain).
    - If the question asks about processes → make the theme action-oriented.
    - If the question asks for comparisons → make the theme span the compared domains with a clear, concrete focus.

    PROCESS (internal reasoning, do not output):
    1) What is the question really asking about (verb/action/concept)?
    2) What new domain or angle does this open?
    3) Create a theme that captures that specific direction.

    AVOID:
    - Abstract philosophical concepts.
    - Repeating previous themes.
    - Overly broad topics that won’t yield specific questions.

    OUTPUT:
    Return ONLY the new theme text , no explanations, no prefixes, no quotes.
    `

    const result = await generateText({ model, prompt })
    return result.text
}