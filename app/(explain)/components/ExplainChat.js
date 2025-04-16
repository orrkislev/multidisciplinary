import { styled } from '@/utils/tw';
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { aiSchemas } from '@/utils/Schema';
import { UnderstandingMeter } from './UnderstandingMeter';
import { useAIImage } from '@/app/(interdisciplinary)/components/AIImage';

const InputContainer = styled.div`
    absolute bottom-0 w-full bg-gray-200 px-8 py-4 flex bg-opacity-50 backdrop-blur-sm rounded-lg
`;
const Input = styled.textarea`
    flex-[8] text-2xl font-geistMono p-4 bg-gray-300
`;
const Submit = styled.button`
    flex-[2] ml-2 bg-gray-500 text-white text-3xl font-geistMono
`;

const AIContainer = styled.div`
    absolute top-[20%] left-16 w-[60%] bg-yellow-200 p-4 text-xl font-geistMono bg-opacity-50 backdrop-blur-sm rounded-lg
`;

const AboutContainer = styled.div`
    absolute top-4 right-4 bg-gray-200 p-4 font-geistMono w-[30%] text-sm bg-opacity-50 backdrop-blur-sm rounded-lg
`;

export function ExplainChat({ character, subject }) {
    const [input, setInput] = useState('');
    const messages = useRef([]);
    const img = useAIImage()
    const chat = useObject({
        api: '/api/chat',
        schema: aiSchemas.chat,
        onFinish: (object, error) => {
            messages.current.push({ role: 'assistant', content: object.object.text })
        }
    });

    useEffect(() => {
        const prompt = `A pixel art portrait of ${character.name}, the ${character.title}, ${character.description} from the year ${character.year}, shown behind the counter of a ${character.scenario} tavern. He/she/they is ${character.physical}. The background shows rustic wooden walls, shelves with bottles. `
        const negative_prompt = 'modern graphics, 3D, photorealistic, blurry, smooth shading, high resolution, cel shading, anime, cartoon, UI elements, text, speech bubbles, logo, watermarks'
        img.get({ prompt, negative_prompt })
    }, [character])

    useEffect(() => {
        messages.current = [{ role: 'user', content: `I want to explain the concept of "${subject}"` }]
        chat.submit({ messages: messages.current, character, subject })
    }, [subject]);

    const submit = () => {
        messages.current.push({ role: 'user', content: input })
        chat.submit({ messages: messages.current, character, subject })
        setInput('')
    }


    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full"
                style={{
                    backgroundImage: img.backgroundImage,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1,
                }}
            />

            {chat.object &&
                <>
                    <AIContainer>{chat.object.text}</AIContainer>
                    <UnderstandingMeter value={chat.object.understanding || 0} />
                </>
            }
            <InputContainer>
                <Input value={input} onChange={(e) => setInput(e.target.value)} />
                <Submit onClick={submit}>Submit</Submit>
            </InputContainer>

            <AboutContainer>
                <p><strong>{character.name}</strong>, {character.title}, ({character.year})</p>
                <p>{character.description}</p>
            </AboutContainer>
        </>
    );
}
