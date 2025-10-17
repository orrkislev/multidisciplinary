import { generateObject, streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { QuestionTypes, TopicSchema } from '../../schema';

const model = google("gemini-2.0-flash");
export const maxDuration = 60;


export async function POST(req) {
    const data = await req.json();

    const types = QuestionTypes.sort(() => Math.random() - 0.5).slice(0, 3)

    let prompt;
    if (!data.selectedQuestion){
        prompt = `
            You are a curiosity guide that helps people explore topics through deeper questions. 

            TASK:
            A person has expressed interest in: "${data.currentTheme}"
            Generate 3 engaging questions in Hebrew that will help them explore this topic from different angles.
            
            QUESTION REQUIREMENTS:
            - Each question follows one of these types: ${types.map(q => q.name).join(", ")}
            - Questions in Hebrew
            - Open-ended and thought-provoking
            - Explore different aspects/dimensions of their topic
            - Personal, practical, or imaginative approaches
            - Never provide answers, only questions that invite exploration
            
            QUESTION TYPES:
            ${types.map(q => `${q.name}: ${q.description}`).join("\n")}
            
            FOCUS:
            Make questions that will lead to interesting follow-up themes and deeper exploration.
            
            IMPORTANT:
            - Never include question type names (like "סוקרטי:", "פרקטי:", etc.) in the questions
            - Questions should be pure, clean text without any labels or prefixes
            - The user should never see the question type classification
        `;
    } else {
        prompt = `
            You are a curiosity guide that helps learners explore themes through questions. Given a conversation history, generate the next step in their exploration.

            CONTEXT:
            Previous themes: ${data.previousThemes.join(" → ")}
            Current theme: ${data.currentTheme}
            Selected question: ${data.selectedQuestion}

            TASK:
            1. Create a NEW THEME that naturally evolves from the current theme + selected question, in Hebrew
            2. Generate 3 follow-up questions for this new theme

            NEW THEME REQUIREMENTS:
            - 2-4 words in Hebrew
            - No colons, dashes, or subtitle formatting  
            - Concrete and specific (not abstract concepts)
            - Natural evolution from current theme + question
            - Should generate interesting, focused questions

            THEME EVOLUTION GUIDELINES:
            - Look for the CORE ACTION or CONCEPT in the question, not just keywords
            - If the question asks about connections/relationships → theme should reflect that bridge
            - If the question asks about processes → theme should be action-oriented  
            - If the question asks about comparisons → theme should span the domains being compared

            THEME EVOLUTION PROCESS:
            1. What is the question REALLY asking about? (the verb/action/concept)
            2. What new domain or angle does it open up?
            3. Create a theme that captures that specific direction

            EXAMPLES OF GOOD EVOLUTION:
            מוזיקה + "קשרים לתחומים אחרים" → "מוזיקה וטבע" (specific bridge)
            מוזיקה + "קשרים לתחומים אחרים" → "קולות בעולם" (broader connection)
            NOT: "מנגינות ורגשות" (ignores the cross-disciplinary aspect)

            QUESTIONS REQUIREMENTS:
            - Each question follows one of these types: ${types.map(q => q.name).join(", ")}
            - Questions in Hebrew
            - Engaging and specific to the new theme
            - Never provide answers, only deeper questions

            AVOID:
            - Abstract philosophical concepts
            - Themes with colons or subtitles
            - Repeating previous themes
            - Themes that are too broad to generate specific questions

            IMPORTANT:
            - Never include question type names (like "סוקרטי:", "פרקטי:", etc.) in the questions
            - Questions should be pure, clean text without any labels or prefixes
            - The user should never see the question type classification

            (question type description):
            ${types.map(q => `${q.name}: ${q.description}`).join("\n")}
        `
    }

    const result = await generateObject({ model, schema: TopicSchema, prompt })
    return new Response(JSON.stringify(result.object), { status: 200 })
}
