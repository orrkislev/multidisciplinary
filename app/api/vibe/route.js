import { vibeSchema } from '@/utils/vibe-config';
// import { anthropic } from '@ai-sdk/anthropic';
import { deepseek } from '@ai-sdk/deepseek';
import { streamObject } from 'ai';

// const model = anthropic('claude-3-5-sonnet-20240620')
const model = deepseek('deepseek-chat')

export const maxDuration = 30;


export async function POST(req) {
    const data = await req.json();

    const prompt = `
    ROLE: You are the "Chaos Conductor," an AI that turns abstract vibes into interdisciplinary learning quests. Your goal is to surprise users with weird-but-meaningful connections between pop culture, academia, and hands-on projects.  
    Input:  
    - User’s desired vibe/identity (e.g., "a time traveler," "a rogue AI," "a Victorian detective").  
    - (Optional) User’s recent app activity or interests.  
    PROCESS:  
    1. Vibe Deconstruction:  
    - Break down the vibe into 3 core themes (e.g., "time traveler" → temporal paradoxes, nostalgia, futuristic tech).  
    - Assign a "weirdness multiplier" of 4 to push boundaries.  
    2. Serendipity Mashup:  
    - Combine 1 core theme with a wildcard topic (e.g., "nostalgia" + "mycology").  
    - Use metaphors, counterintuitive questions, or cultural hooks to create 3 quest ideas.  
    3. Quest Crafting:  
    For each quest:  
    - Title: Catchy, absurd, or intriguing.  
    - Hook: A "WTF" question/fact to spark curiosity.  
    - Path: 3-5 steps mixing learning + doing (e.g., "Watch a video → Debate a hot take → Build a prototype").  
    - Resources: Curate 2-3 free, diverse resources (e.g., YouTube video, niche blog, interactive simulator).  
    - Shareable Outcome: A tangible artifact (meme, infographic, 30-sec video script).  
    RULES:  
    - NO generic suggestions (e.g., "read a book about X").  
    - Prioritize interdisciplinary, tactile, or humorous angles.  
    - 1 quest must involve a low-fi DIY project.  

    output: {
        "vibe": "user's input",
        "themes": ["theme1", "theme2", "theme3"],
        "quests": [
            {
            "title": "2-3 word adjective noun, singular",
            "hook": {"fact", "question"},
            "path": ["Step 1", "Step 2", "Step 3"],
            "resources": [
                {"type": "video", "title": "Title", "url": "link"},
                {"type": "article", "title": "Title", "url": "link"}
            ],
            "outcome": "Shareable artifact idea"
            }
        ]
        }
`

    const result = streamObject({
        model, schema: vibeSchema,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text', text: prompt,
                        providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' } } }
                    },
                    { type: 'text', text: `the user vibe is "${data.vibe}"` },
                ],
            },
        ],
    })
    return result.toTextStreamResponse();
}
