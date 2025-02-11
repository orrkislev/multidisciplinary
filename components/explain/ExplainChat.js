import { styled } from '@/utils/tw';
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { aiSchemas } from '@/utils/Schema';
import { UnderstandingMeter } from './UnderstandingMeter';

const InputContainer = styled.div`
    absolute bottom-0 w-full bg-gray-200 px-8 py-4 flex
`;
const Input = styled.textarea`
    flex-[8] text-2xl font-geistMono p-4 bg-gray-300
`;
const Submit = styled.button`
    flex-[2] ml-2 bg-gray-500 text-white text-3xl font-geistMono
`;

const AIContainer = styled.div`
    absolute top-[20%] left-16 w-[60%] bg-gray-200 p-4 text-xl font-geistMono
`;

const AboutContainer = styled.div`
    absolute top-4 right-4 bg-gray-200 p-4 font-geistMono w-[30%] text-sm
`;

export function ExplainChat({ character, subject }) {
    const [input, setInput] = useState('');
    const messages = useRef([]);
    const chat = useObject({
        api: '/api/chat',
        schema: aiSchemas.chat,
        onFinish: (object, error) => {
            messages.current.push({ role: 'assistant', content: object.object.text })
        }
    });

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

