'use client'

import { subjects } from '@/utils/topics';
import React, { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { namesSchema } from '@/utils/Schema';
import { useUserData } from '../utils/ai-config';
import { tw } from '@/utils/tw';
import { Dices, Minus } from 'lucide-react';

export const SingleSubject = tw`text-sm p-1 px-2 cursor-pointer
    text-gray-500 hover:text-white 
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
    text-white text-center hover:text-indigo-800
    grow-[2]
    bg-indigo-800 bg-opacity-50 hover:bg-transparent
    transition-colors duration-300
    hover:opacity-50
`;

const ButtonIcon = tw`flex items-center justify-center text-gray-500 hover:text-indigo-800 p-1 rounded hover:bg-gray-200`

const Seperator = tw`w-full h-1 border-b `

// return the index of the first occurrence of the input in the string, normalized, or -1 if not found
function search(s, input) {
    const i = s.toLowerCase().indexOf(input.toLowerCase())
    if (i == -1) return 2
    return i - s.length
}


export default function Subjects() {
    const { subject1, subject2, setSubjects } = useUserData()
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

    const selected = [subject1, subject2].filter(s => s)

    const addSubject = (newSub) => {
        if (subject1 && subject2) {
            if (subject1 == newSub) setSubjects(newSub, null)
            else if (subject2 == newSub) setSubjects(subject1, null)
            else setSubjects(newSub, null)
        } else if (subject1) {
            if (subject1 == newSub) setSubjects(null, null)
            else setSubjects(subject1, newSub)
        } else setSubjects(newSub, null)
    }

    const clickRandom = () => {
        addSubject(topics[Math.floor(Math.random() * topics.length)])
    }
    const clearInput = () => {
        setInput('')
        setSubjects(null, null)
    }

    const list = [
        ...aiSubjects.map(s => ({ name: s, ai: true })),
        ...topics.map(s => ({ name: s })),
    ]
    if (input.length > 0) {
        list.unshift({ name: input, input: true })
    }

    return (
        <div className="h-screen relative flex flex-col gap-2 overflow-y-auto border-l border-gray-300">
            <div className="flex justify-center items-center p-2">
                <ButtonIcon onClick={clickRandom}>
                    <Dices className="w-4 h-4" />
                </ButtonIcon>
            </div>
            <Seperator />
            <div>
                <input
                    type="text"
                    className="text-sm text-center bg-transparent focus:outline-none text-indigo-800 font-mono w-full"
                    placeholder="Type a subject"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
            <Seperator />
            {selected.length > 0 && selected.map((subject, index) => (
                <SelecteSubject key={index} onClick={() => addSubject(subject)}>
                    {subject}
                </SelecteSubject>
            ))
            }
            <Seperator />
            <div className="">
                {list.map((subject, index) => (
                    <SingleSubject key={index}
                        onClick={() => addSubject(subject.name)}
                        {...subject}
                    >
                        {subject.name}
                    </SingleSubject>
                ))}
            </div>
        </div>
    );
}