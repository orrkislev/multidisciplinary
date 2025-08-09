import { styled, tw } from '@/utils/tw';
import { useEffect, useRef, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { aiSchemas } from '@/utils/Schema';
import { Send } from 'lucide-react';


const Text = tw`
    flex w-[70%] text-sm font-geistMono p-2
    ${({ role }) => role === 'user' ?
        'text-right rounded-l-xl bg-gray-200 self-end' :
        'text-left rounded-r-xl bg-gray-100 self-start'}
`;

const AboutContainer = styled.div`
    border border-gray-300 bg-gray-200 p-4 font-geistMono text-sm bg-opacity-50 backdrop-blur-sm rounded-lg
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
        messages.current = [{ role: 'user', content: `I can explain the concept of "${subject}"` }]
        chat.submit({ messages: messages.current, character, subject })
    }, [subject]);

    const submit = () => {
        messages.current.push({ role: 'user', content: input })
        chat.submit({ messages: messages.current, character, subject })
        setInput('')
    }


    return (
        <div className="flex h-screen w-screen gap-4 p-4 justify-start"
            style={{
                backgroundImage: `linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.35) 25%,
                    rgba(0,0,0, 0.05) 25%,
                    rgba(0,0,0, 0.05) 50%,
                    rgba(255, 255, 255, 0.35) 50%,
                    rgba(255, 255, 255, 0.35) 75%,
                    rgba(0,0,0, 0.05) 75%,
                    rgba(0,0,0, 0.05)
                  )`,
                backgroundSize: '1rem 1rem',
            }}
        >
            <div className='w-[30%]'>
                <AboutContainer>
                    <div className='flex justify-center items-center p-2'>
                        <div className='w-16 h-16 bg-gray-200 rounded-full flex flex-col justify-center items-center'>
                            {character.name.split(' ').map((name, i) => (
                                <p key={i} className='text-sm text-center'>{name}</p>
                            ))}
                        </div>
                    </div>
                    <p><strong>{character.name}</strong>, {character.title}, ({character.year})</p>
                    <p>{character.description}</p>
                    {chat.object && <UnderstandingMeter value={chat.object.understanding} />}
                </AboutContainer>
            </div>

            <div className="w-[35em] bg-gray-50 border border-gray-300 flex flex-col justify-between rounded-lg">
                <div className="flex-1 w-full h-full overflow-y-auto flex flex-col gap-4 justify-end pb-8">
                    {messages.current.map((message, i) => (
                        <Text key={i} role={message.role}>{message.content}</Text>
                    ))}
                </div>
                <div className="p-2 bg-gray-100 border-t border-gray-300 flex">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)}
                        className="flex-1 resize-none bg-transparent"
                        placeholder="Your answer"
                    />
                    <button onClick={submit} className="p-2 hover:bg-gray-200 rounded-lg">
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}


// value is between -10 and 10 
function UnderstandingMeter({ value }) {
    if (value < -10) value = -10;
    if (value > 10) value = 10;
    value = (value + 10) / 20;

    return (
        <div className="mt-12 flex flex-col gap-1">
            <p className="text-xs text-gray-400">level of understanding</p>
            <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-sky-300 rounded-full" style={{ width: `${value * 100}%` }}></div>
            </div>
        </div>
    )
}