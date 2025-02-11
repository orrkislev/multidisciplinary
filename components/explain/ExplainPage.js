'use client'

import { aiSchemas } from "@/utils/Schema";
import { experimental_useObject as useObject } from 'ai/react';
import { useState } from "react";
import { ExplainChat } from "./ExplainChat";
import { styled } from '@/utils/tw';

const Container = styled.div`min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-16`;
const Title = styled.h1`text-4xl md:text-6xl text-gray-800 uppercase text-center select-none font-geistMono`;
const Form = styled.form`flex flex-col items-center`;
const Input = styled.input`border border-gray-500 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 font-geistMono`;
const Button = styled.button`bg-gray-500 text-white font-bold py-2 px-8 rounded-full hover:bg-gray-800 transition mt-4 font-geistMono`;



export default function ExplainPage() {
    const [input, setInput] = useState('');
    const [readyToChat, setReadyToChat] = useState(false);
    const character = useObject({
        api: '/api/name',
        schema: aiSchemas.character,
        onFinish: (object, error) => {
            if (object) setReadyToChat(true);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        character.submit({
            prompt: `Objective:
                Given a user-provided subject (e.g., "Settlers of Catan," "yoga," "quantum computing"), generate a unique character who is unfamiliar with the subject but has a compelling perspective/limitation that forces the user to explain the topic creatively. The character should feel thematically relevant to the subject while introducing delightful friction (e.g., cultural, physiological, or conceptual constraints).
                [PROCESS]:
                -- Analyze the Subject:
                Identify core themes, mechanics, or cultural context of the subject.
                * Example: "Settlers of Catan" → strategy, resource trading, competition, community-building.
                -- Brainstorm Character Archetypes:
                Generate 3–5 potential characters with contrasting contexts (historical, fictional, conceptual) that intersect with the subject’s themes.
                Prioritize characters with specific limitations (e.g., no modern references, alien anatomy, cultural gaps) or quirky communication styles (e.g., speaks in metaphors, hates abstract terms).
                -- Select the Best Character:
                Choose the most thematically resonant and playfully challenging option.
                Ensure the character’s background forces the user to rethink their assumptions (e.g., explaining "social media" to a 17th-century librarian who organizes knowledge via handwritten indexes).
                -- Define the Character’s Profile:
                Name/Title: Give them a memorable identity (e.g., "Zorblax the Amorphous," "Madame Lafleur, 1800s Ballroom Etiquette Coach").
                Era/Origin: Time period, location, or fictional universe.
                Profession/Role: What they do in their world.
                Key Quirks/Limitations: What makes explaining the subject hard? (e.g., "only understands barter economies," "interprets everything as dance moves").
                Communication Style: Formal, skeptical, curious, etc.
                [OUTPUT]:
                Character Introduction: A vivid 2–3 sentence hook.
                Challenge to User: A playful directive framing the explanation hurdle (e.g., "Convince Zorblax that yoga isn’t a weaponized limb-removal ritual").
                [EXAMPLE]:
                Subject: "Settlers of Catan"
                Character: Master Enzo Vittori, Venetian Shipbuilder (1442)
                Introduction: "A gruff master craftsman who builds warships for the Venetian fleet, Enzo cares only about timber, iron, and outmaneuvering rival traders. He distrusts 'frivolous' games and thinks dice are for gamblers, not strategists."
                Challenge: "Explain why Settlers of Catan isn't a waste of good wood. Use examples from shipbuilding or trade routes, and avoid modern terms like 'board game' or 'victory points.'"

                the user-provided subject is: ${input}
                `,
            key: 'character'
        })
    };

    const titleText = 'WHAT TOPIC DO YOU THINK YOU CAN EXPLAIN?';

    if (!readyToChat)
        return (
            <Container>
                <div className="grid grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2 mb-16 gap-2 md:gap-8">
                    {titleText.split(' ').map((word, i) => (
                        <Title key={i}>{word}</Title>
                    ))}
                </div>

                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Settlers of Catan, yoga, quantum computing...'
                    />
                    <Button type="submit">GO</Button>
                </Form>
            </Container>
        );

    else return <ExplainChat character={character.object} subject={input} />
}

