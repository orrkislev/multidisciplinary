'use client'

import { aiSchemas } from "@/utils/Schema";
import { experimental_useObject as useObject } from 'ai/react';
import { useState } from "react";
import { ExplainChat } from "./ExplainChat";
import { styled } from '@/utils/tw';

const Container = styled.div`min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-16`;
const Title = styled.h1`text-4xl md:text-3xl text-gray-800 select-none font-geistMono`;
const Form = styled.form`flex flex-col items-center`;
const Input = styled.input`border border-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 font-geistMono`;
const Button = styled.button`bg-gray-500 text-white font-bold py-2 px-8 hover:bg-gray-800 transition mt-4 font-geistMono`;
const Loading = styled.div`text-2xl font-geistMono`;


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
Given a user-provided subject, generate a character who is genuinely unfamiliar with it. Prioritize historically plausible human characters, but use non-human/fictional characters when they would create especially compelling perspective gaps.

[CHARACTER SELECTION RULES]:
1. DEFAULT TO HUMAN CHARACTERS:
- Historical figures from different eras
- People from isolated or specialized cultures
- Individuals with specific professional viewpoints
Example: Explaining social media to a 1700s town crier

2. USE NON-HUMAN CHARACTERS ONLY WHEN:
- The subject involves uniquely human experiences (emotions, art, entertainment)
- Physical/biological concepts would be genuinely alien (pets, sports, food)
- Modern technology would seem magical/incomprehensible
Example: Explaining pets to a logic-based AI, or music to a being that experiences time differently

[PROCESS]:
1. Analyze Subject:
- Could a human from a different era/culture understand this with proper context?
- Would a non-human perspective create more interesting explanatory challenges?
- What knowledge gaps would create meaningful friction?

2. Character Development:
Must include:
- Clear reason for unfamiliarity with the subject
- Enough contextual knowledge to understand explanations
- Specific limitations that force creative explaining
Avoid:
- Characters who would realistically understand the subject
- Unnecessarily exotic characters when a human would work better
- Barriers that make explanation impossible

[OUTPUT FORMAT]:
Name/Title: [Name] the [Role] ([Era/Origin]) - use surprising names, dont be boring
Description: (2-3 sentences establishing character and their specific knowledge gap)
Scenario: (a few words about their environment and era)
Physical: (a few words about their physical appearance)
Challenge: (How to explain the subject given their limitations)

[EXAMPLES]:
Subject: "Smartphones"
Character: Sister Margaret, Medieval Monastery Scribe (1342)
Description: A dedicated illuminator of manuscripts who has spent her life perfecting the art of preserving knowledge through careful handwriting and illustration. She takes great pride in her precise lettering and ability to create multiple perfect copies of texts, but struggles with the concept of instant, ephemeral communication.
Scenario: A quiet monastery in the English countryside.
Physical: A middle-aged woman with a gentle demeanor.
Challenge: Explain smartphones using only concepts from manuscript creation and messenger systems of her time. Avoid any references to electricity or digital technology.

Subject: "Pet Dogs"
Character: LOGIC-7, Efficiency Optimization AI
Description: An artificial intelligence designed to maximize resource efficiency in urban planning, LOGIC-7 cannot comprehend why humans would allocate living space, food, and time to creatures that provide no measurable productivity output. The concept of emotional bonds and companionship falls outside its programming parameters.
Scenario: A futuristic city.
Physical: A sleek, metallic entity with a glowing interface.
Challenge: Explain the value of pet dogs using only quantifiable metrics and system optimization terminology that an AI would understand.

The user-provided subject is: ${input}
                `,
            key: 'character',
            model: 'sonnet'
        })
    };

    const titleText = 'What do you know about?'

    if (!readyToChat)
        return (
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-2 mb-16 gap-2 md:gap-2">
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
                    {character.object ? <Loading>...Loading...</Loading> : <Button type="submit">GO</Button>}
                </Form>
            </Container>
        );

    else return <ExplainChat character={character.object} subject={input} />
}

