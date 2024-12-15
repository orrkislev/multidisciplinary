'use client'

import { subjects } from '@/utils/topics';
import React, { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { tw } from '@/utils/tw';
import { namesSchema } from '@/utils/AiData';

export const SingleSubject = tw`text-md p-1 px-2 border-2 border-white rounded-full cursor-pointer bg-gradient-to-tr
    text-black hover:text-white 
    from-transparent hover:from-rose-500 
    to-transparent hover:to-yellow-500 transition-colors duration-300`

const topics = subjects.sort(() => Math.random() - 0.5)


export default function Subjects({ onUpdate }) {
    const { error, object, submit } = useObject({ api: '/api/subjects', schema: namesSchema });
    const [selected, setSelected] = useState([])
    const [input, setInput] = useState('')

    useEffect(() => {
        if (input.length == 0) return

        const timeout = setTimeout(() => submit({ input }), 500)
        return () => clearTimeout(timeout)
    }, [input])

    useEffect(() => {
        onUpdate(selected)
    }, [selected])

    const click = (subject) => {
        if (selected.includes(subject)) {
            setSelected(selected.filter(s => s !== subject))
        } else {
            if (selected.length >= 2) {
                setSelected([subject])
            } else {
                setSelected([...selected, subject])
            }
        }
    }

    let specials = []
    const showTopics = [...topics]
    if (object?.subjects && input.length > 0) {
        // showTopics.push(...object.subjects)
        object.subjects.forEach(subject => showTopics.unshift(subject))
        //     const index = Math.floor(Math.random() * showTopics.length)
        //     showTopics.splice(index, 0, subject)
        // })
        // specials = object.subjects
    }

    return (
        <div className='bg-gradient-to-br from-slate-100 to-gray-200 relative h-[100vh] flex flex-col pt-4 overflow-hidden'>
            <div className='flex items-center justify-center h-16 bg-gradient-to-br from-slate-100 to-gray-200 mb-4'>
                <input type="text" className='w-1/2 p-2 text-lg text-center bg-transparent border-b-2 border-white focus:outline-none text-black text-xl font-mono'
                    placeholder='Type a subject' value={input} onChange={(e) => setInput(e.target.value)} />
            </div>
            <div className='mx-2 overflow-scroll overflow-x-scroll'>
                <div className='flex gap-2 flex-wrap space-between'>
                    {selected.map((subject, index) => (
                        <SingleSubject key={index} onClick={() => click(subject)} className='bg-gradient-to-br from-red-500 to-yellow-500'>
                            {subject}
                        </SingleSubject>
                    ))}
                    {showTopics.filter(t => !selected.includes(t)).map((subject, index) => (
                        <SingleSubject key={index} onClick={() => click(subject)} className={object?.subjects?.includes(subject) ? 'bg-gradient-to-br from-lime-500 to-orange-300' : ''}>
                            {subject}
                        </SingleSubject>
                    ))}
                </div>
            </div>

        </div>
    );
}