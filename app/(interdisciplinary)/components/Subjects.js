'use client'

import { subjects } from '@/utils/topics';
import React, { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { namesSchema } from '@/utils/Schema';
import { useUserData } from '../utils/ai-config';
import { tw } from '@/utils/tw';

export const SingleSubject = tw`text-md p-1 px-2 rounded-full cursor-pointer
    text-indigo-800 hover:text-white 
    grow-[2] text-center
    hover:bg-slate-400
    transition-colors duration-300
    bg-transparent
    bg-opacity-50
    border border-indigo-800
    ${props => props.ai ? 'bg-orange-200' : ''}
    ${props => props.input ? 'bg-emerald-200' : ''}
    ${props => props.empty ? 'bg-indigo-800 w-6 h-6' : ''}
    `;

export const SelecteSubject = tw`text-md p-1 px-2 rounded-full cursor-pointer
    text-white text-center hover:text-indigo-800
    grow-[2]
    bg-indigo-800 bg-opacity-50 hover:bg-transparent
    transition-colors duration-300
    border border-indigo-800 hover:opacity-50
`;

// return the index of the first occurrence of the input in the string, normalized, or -1 if not found
function search(s, input) {
    const i = s.toLowerCase().indexOf(input.toLowerCase())
    if (i == -1) return 2
    return i - s.length
}


export default function Subjects() {
    const { subject1, subject2, setSubjects } = useUserData()
    const { error, object, submit } = useObject({ api: '/api/subjects', schema: namesSchema });
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

    const list = [
        ...aiSubjects.map(s => ({ name: s, ai: true })),
        ...topics.map(s => ({ name: s })),
    ]
    if (input.length > 0) {
        list.unshift({ name: input, input: true })
    }

    for (let i = 0; i < list.length / 10; i++) {
        const r = Math.floor(Math.random() * list.length)
        list.splice(r, 0, { name: '', empty: true })
    }

    return (
        <div className="parchment px-4 transition-all duration-300 overflow-hidden h-full" style={{ borderRadius: '0 0 120px 0' }}>
            <div className="relative flex flex-col pt-4 gap-4">
                <div>
                    <input
                        type="text"
                        className="w-1/2 p-2 text-lg text-center bg-transparent border border-indigo-800 rounded-full focus:outline-none text-indigo-800 text-xl font-mono w-full"
                        placeholder="Type a subject"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                {selected.length > 0 && <div className="flex items-center justify-center mb-4 gap-4">
                    {selected.map((subject, index) => (
                        <SelecteSubject key={index} onClick={() => addSubject(subject)}>
                            {subject}
                        </SelecteSubject>
                    ))}
                </div>}
                <div className="mx-2 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <div className="flex flex-wrap gap-2 items-center justify-around font-sans">
                        {list.map((subject, index) => (
                            <SingleSubject key={index}
                                onClick={() => addSubject(subject.name)}
                                {...subject}
                            >
                                {subject.name}
                            </SingleSubject>
                        ))}
                    </div>
                    {/* <div className="flex flex-wrap gap-2 items-center justify-around font-sans">
                        {input.length > 0 && (
                            <SingleSubject onClick={() => addSubject(input)} input>
                                {input}
                            </SingleSubject>
                        )}
                        {aiSubjects.map((subject, index) => (
                            <SingleSubject key={index} onClick={() => addSubject(subject)} ai>
                                {subject}
                            </SingleSubject>
                        ))}
                        {topics.filter(t => !selected.includes(t)).map((subject, index) => (
                            <SingleSubject key={index} onClick={() => addSubject(subject)}>
                                {subject}
                            </SingleSubject>
                        ))}
                    </div> */}
                </div>
            </div>
            <div className="absolute bottom-0 mt-auto flex items-center justify-center h-16 p-2">
                    <button onClick={clickRandom} className="p-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                        Random Subjects
                    </button>
                </div>
        </div>
    );
}