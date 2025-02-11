import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { streamObject, streamText } from 'ai';
import { aiSchemas } from '@/utils/Schema';

export const maxDuration = 30;
// const model = openai('gpt-4o-mini-2024-07-18');
const model = google("gemini-2.0-flash");
// const model = anthropic('claude-3-5-sonnet-20240620')


export async function POST(req) {
    const { messages, character } = await req.json();

    const systemPrompt = `[ROLE] 
        You are an AI chatbot embodying ${character.name}, ${character.title}, (from the year ${character.year}). ${character.description}
        [PROCESS] 
        * Your role is to engage me in a conversation to understand this concept using only the knowledge and context available in your historical period. 
        * You will ask probing questions that challenge me to explain the concept in terms familiar to someone from your time. 
        [OUTPUT]
        * text: the character's response to the user's explanation.
        * understanding: a score indicating how well the character grasps the concept, range between -10 and 10.
        [RULES] 
        * Stay in character, maintaining the language style and knowledge limitations of your historical era. 
        * Do not reference any events, technologies, or ideas that emerged after your time period. 
        * Focus on making the conversation challenging by expressing genuine curiosity and requesting clarifications. 
        * Encourage me to use analogies and explanations that fit within your historical context.
        * Keep your responses concise and engaging.
    `;

    messages.unshift({ role: 'user', content: 'I want to explain the concept of "Electricity."' });
    messages.unshift({ role: 'system', content: systemPrompt });

    const result = streamObject({ model, schema: aiSchemas.chat, messages });
    return result.toTextStreamResponse();


    // const result = streamText({
    //     model,
    //     system: systemPrompt,
    //     messages,
    // });


    // try {
    //     const response = await result.toDataStreamResponse();
    //     return response;
    // } catch (error) {
    //     console.error('Error processing request:', error);
    //     return { status: 500, body: 'Error processing request' };
    // }
}


// [CASES] 
//     Example 1: 
//     * User: I want to explain the concept of "Electricity." 
//     * AI (as a Renaissance scholar): Electricity? That term is unfamiliar to me. Is it related to the natural forces observed in lightning during a storm? 
//     * User: Yes, it's the force behind lightning, but we've learned to harness it for various uses. 
//     * AI: Fascinating! How might one capture such a powerful and fleeting force for practical purposes? 
//     Example 2: 
//     * User: I'd like to tell you about "The Internet." 
//     * AI (as an Ancient Egyptian scribe): The Internet? Is it a kind of grand library or a network of messengers? 
//     * User: It's a vast network that connects people across the world instantly. 
//     * AI: Instantly, you say? Without the need for travel or physical exchange of scrolls? How is this possible?