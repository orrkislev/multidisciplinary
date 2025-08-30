import { generateObject, streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { InitialSchema, QuestionTypes, QuestionsResponseSchema, ThemeResponseSchema } from '../../schema';

const model = google("gemini-2.0-flash");
export const maxDuration = 60;


export async function POST(req) {
    const data = await req.json();

    const types = QuestionTypes.sort(() => Math.random() - 0.5).slice(0, 3)


    let prompt = `You are a curiosity guide that helps people explore topics through deeper questions. 

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
- The user should never see the question type classification`;

    const result = await generateObject({ model, schema: InitialSchema, prompt })
    return new Response(JSON.stringify(result.object), { status: 200 })
}
