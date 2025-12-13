import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { SourcesSchema } from '../../schema';

const model = google("gemini-2.5-flash");
export const maxDuration = 60;


export async function POST(req) {
    const data = await req.json();

    let prompt = `You are a learning guide that helps students understand who else is exploring their theme and where they can learn more.

TASK:
Given a theme: "${data.theme}"
Provide helpful context in Hebrew about who studies this and where to learn more.

OUTPUT:
1. WHO ELSE (2-3 examples):
- Professions, researchers, or communities that work with this theme
- Be specific but accessible (not overly academic)

2. WHERE TO LEARN (mix of specific + general):
- 1-2 specific resources if relevant (books, documentaries, talks)  
- 2-3 general learning directions (courses, communities, experiences)

TONE:
- Encouraging and practical
- Hebrew throughout
- Avoid overwhelming with too many options
- Focus on accessible entry points

`;

    const result = await generateObject({ model, schema: SourcesSchema, prompt })
    return new Response(JSON.stringify(result.object), { status: 200 })
}
