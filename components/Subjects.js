'use client'

import { subjects } from '@/utils/topics';
import React, { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { tw } from '@/utils/tw';
import { namesSchema } from '@/utils/Schema';
import { SUBJECTS, useSubjects } from '@/utils/useAI';

export const SingleSubject = tw`text-md p-1 px-2 border-2 border-white rounded-full cursor-pointer bg-gradient-to-tr
    text-black hover:text-white 
    hover:from-rose-500 
    hover:to-yellow-500 transition-colors duration-300`

const topics = subjects.sort(() => Math.random() - 0.5)


export default function Subjects() {
    const { subject1, subject2, setSubjects } = useSubjects()
    const { error, object, submit } = useObject({ api: '/api/subjects', schema: namesSchema });
    const [aiSubjects, setAiSubjects] = useState([])
    const [input, setInput] = useState('')

    useEffect(() => {
        setAiSubjects([])
        if (input.length == 0) return

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
        console.log('adding subject', newSub)
        if (subject1 && subject2) {
            if (subject1 == newSub) setSubjects(newSub, null)
            else if (subject2 == newSub) setSubjects(subject1, null)
            else setSubjects(newSub, null)
        } else if (subject1) {
            if (subject1 == newSub) setSubjects(null, null)
            else setSubjects(subject1, newSub)
        } else setSubjects(newSub, null)
    }

    return (
        <div className={`bg-gradient-to-br from-slate-100 to-gray-200 relative h-[100vh] flex flex-col pt-4 overflow-hidden transition-all duration-300`}>
            <div className='flex items-center justify-center h-16 bg-gradient-to-br from-slate-100 to-gray-200 mb-4'>
                <input type="text" className='w-1/2 p-2 text-lg text-center bg-transparent border-b-2 border-white focus:outline-none text-black text-xl font-mono'
                    placeholder='Type a subject' value={input} onChange={(e) => setInput(e.target.value)} />
            </div>
            <div className='mx-2 overflow-scroll overflow-x-scroll'>
                <div className='flex gap-2 flex-wrap space-between'>
                    {selected.map((subject, index) => (
                        <SingleSubject key={index} onClick={() => addSubject(subject)} className='bg-gradient-to-br from-red-500 to-yellow-500'>
                            {subject}
                        </SingleSubject>
                    ))}

                    {aiSubjects.map((subject, index) => (
                        <SingleSubject key={index} onClick={() => addSubject(subject)} className='bg-gradient-to-br from-lime-500 to-orange-500'>
                            {subject}
                        </SingleSubject>
                    ))}

                    {topics.filter(t => !selected.includes(t)).map((subject, index) => {
                        return (
                            <SingleSubject key={index} onClick={() => addSubject(subject)}>
                                {subject}
                            </SingleSubject>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}