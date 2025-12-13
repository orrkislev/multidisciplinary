import { vibeSchema } from '@/utils/vibe-config';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';

const model = google("gemini-2.5-flash");
export const maxDuration = 60;


export async function POST(req) {
    const data = await req.json();


    let prompt = `
    ROLE: You are the "Chaos Conductor," an AI that turns abstract vibes into interdisciplinary learning quests. Your goal is to surprise users with weird-but-meaningful connections between pop culture, academia, and hands-on projects.  
    Input:`

    if (data.vibe) {
        prompt += `User's desired vibe/identity (e.g., "a time traveler," "a rogue AI," "a Victorian detective").`
    } else if (data.image) {
        prompt += `User's desired vibe/identity via image or meme`
    }

    prompt += `
    PROCESS:  
    1. Vibe Deconstruction:  
    - Break down the vibe into 3 core themes (e.g., "time traveler" → temporal paradoxes, nostalgia, futuristic tech).  
    - Themes should be specific, quirky, and open to interpretation.
    2. Serendipity Mashup:  
    - Assign a "weirdness multiplier" of [1-5] to push boundaries.  
    - Combine 1 core theme with a wildcard topic (e.g., "nostalgia" + "mycology"). pick surprising combos based on the weirdness factor.
    - Use metaphors, counterintuitive questions, or cultural hooks to create 3 quest ideas.  
    3. Craft 3 Quests:
    For each quest:  
    - Title: Person-focused role or occupation with an unusual specialty (e.g., "Quantum Shaman," "Data Alchemist").
    - Hook: An intriguing or absurd "WTF" fact to spark curiosity.  
    - Path: 3-5 steps mixing learning + doing (e.g., "Watch a video → Debate a hot take → Build a prototype").  
    - Resources: Curate 2-3 free, diverse resources (e.g., YouTube video, niche blog, interactive simulator).  
    - Shareable Outcome: A tangible artifact (meme, infographic, 30-sec video script).  
    RULES:  
    - NO generic suggestions (e.g., "read a book about X").  
    - Prioritize interdisciplinary, tactile, or humorous angles.  
    - 1 quest must involve a low-fi DIY project.  
`

    // output: {
    //     "vibe": "user's input",
    //     "themes": ["theme1", "theme2", "theme3"],
    //     "quests": [
    //         {
    //         "title": "2-3 word [adjective] [profession/role], singular",
    //         "hook": {"fact", "question"},
    //         "path": ["Step 1", "Step 2", "Step 3"],
    //         "resources": [
    //             {"type": "video", "title": "Title", "url": "link"},
    //             {"type": "article", "title": "Title", "url": "link"}
    //         ],
    //         "outcome": "Shareable artifact idea"
    //         }
    //     ]
    //     }

    const content = [{ type: 'text', text: prompt }]

    if (data.vibe) {
        content.push({ type: 'text', text: `the user vibe is "${data.vibe}"` })
    } else if (data.image) {
        content.push({ type: 'image', image: data.image })
    }

    const result = streamObject({
        model, schema: vibeSchema,
        messages: [{ role: 'user', content }],
    })
    return result.toTextStreamResponse();
}
