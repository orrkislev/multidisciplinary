'use client'

import { subjects } from '@/utils/topics';
import React, { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { namesSchema } from '@/utils/Schema';
import { tw } from '@/utils/tw';
import { Dices, Minus } from 'lucide-react';
import { dataActions, useData } from '../utils/store';

export const SingleSubject = tw`text-sm p-1 px-2 cursor-pointer
    hover:text-white 
    grow-[2] text-center
    hover:bg-slate-400
    transition-colors duration-300
    bg-transparent
    bg-opacity-50
    ${props => props.ai ? 'bg-orange-200' : ''}
    ${props => props.input ? 'bg-emerald-200' : ''}
    ${props => props.empty ? 'bg-indigo-800 w-6 h-6' : ''}
    `;

export const SelecteSubject = tw`text-md p-1 px-2 cursor-pointer
    text-white text-center hover:text-primary-800
    grow-[2]
    bg-primary-600 bg-opacity-50 hover:bg-transparent
    transition-colors duration-300
    hover:opacity-50
`;

const ButtonIcon = tw`flex items-center justify-center hover:text-primary-800 p-1 rounded hover:bg-primary-200 transition-all duration-300`

const Seperator = tw`w-full h-1 border-b border-neutral-300`

// return the index of the first occurrence of the input in the string, normalized, or -1 if not found
function search(s, input) {
    const i = s.toLowerCase().indexOf(input.toLowerCase())
    if (i == -1) return 2
    return i - s.length
}


export default function Subjects() {
    // const { subject1, subject2, setSubjects } = useUserData()
    const currentMerge = useData(state => state.getActiveMerge());
    const { object, submit } = useObject({ api: '/api/subjects', schema: namesSchema });
    const [aiSubjects, setAiSubjects] = useState([])
    const [input, setInput] = useState('')
    const [topics, setTopics] = useState([...subjects].sort(() => Math.random() - 0.5))

    useEffect(() => {
        setAiSubjects([])
        if (input.length == 0) return

        setTopics(subjects.sort((a, b) => search(a, input) - search(b, input)))

        const timeout = setTimeout(() => submit({ input }), 500)
        return () => clearTimeout(timeout)
    }, [input])

    useEffect(() => {
        if (object?.subjects) {
            setAiSubjects(object.subjects.map(s => `${s} (${input})`))
        }
    }, [object])

    const clickRandom = () => {
        dataActions.toggleSubject(topics[Math.floor(Math.random() * topics.length)], currentMerge.id)
    }

    const list = [
        ...aiSubjects.map(s => ({ name: s, ai: true })),
        ...topics.map(s => ({ name: s })),
    ]
    if (input.length > 0) {
        list.unshift({ name: input, input: true })
    }

    return (
        <>
            <div className="flex justify-center items-center p-2">
                <ButtonIcon onClick={clickRandom}>
                    <Dices className="w-4 h-4" />
                </ButtonIcon>
            </div>
            <Seperator />
            <div>
                <input
                    type="text"
                    className="text-sm text-center bg-transparent focus:outline-none text-primary-600 font-mono w-full"
                    placeholder="Type a subject"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
            <Seperator />
            {currentMerge?.subjects && currentMerge?.subjects.map((subject, index) => (
                <SelecteSubject key={index} onClick={() => dataActions.toggleSubject(subject, currentMerge.id)}>
                    {subject}
                </SelecteSubject>
            ))
            }
            <Seperator />
            <div className="overflow-y-auto">
                {list.map((subject, index) => (
                    <SingleSubject key={index}
                        onClick={() => dataActions.toggleSubject(subject.name, currentMerge.id)}
                        {...subject}
                    >
                        {subject.name}
                    </SingleSubject>
                ))}
            </div>
        </>
    );
}