'use client'

import { subjects } from '@/utils/topics';
import React, { useEffect, useState } from 'react';
import { tw } from '@/utils/tw';

export const SingleSubject = tw`text-md p-1 px-3 border-2 border-white rounded-full cursor-pointer bg-gradient-to-tr
    text-black hover:text-white 
    from-transparent hover:from-rose-500 
    via-transparent hover:via-rose-400 
    to-transparent hover:to-yellow-500 transition-colors duration-300`

export default function Subjects({ onUpdate }) {
    const [selected, setSelected] = useState([])
    const [input, setInput] = useState('')
    const [topics, setTopics] = useState(subjects)

    useEffect(() => {
        if (input.length == 0) {
            setTopics(subjects.sort(() => Math.random() - 0.5))
            return
        }

        const timeout = setTimeout(() => {
            fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input })
            }).then(res => res.json())
                .then(data => {
                    setTopics(data.names)
                })
        }, 500)
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

    return (
        <div className='overflow-hidden h-32 hover:h-[50vh] transition-all duration-500 bg-gradient-to-br from-slate-100 to-gray-200 relative'>
            <div className='flex items-center justify-center h-16 bg-gradient-to-br from-slate-100 to-gray-200'>
                <input type="text" className='w-1/2 p-2 text-lg text-center bg-transparent border-b-2 border-white focus:outline-none text-black text-xl font-mono'
                    placeholder='Type a subject' value={input} onChange={(e) => setInput(e.target.value)} />
            </div>
            <div className='mx-8'>
                <div className={`flex gap-2 flex-wrap space-between`}>
                    {selected.map((subject, index) => (
                        <SingleSubject key={index} onClick={() => click(subject)} className='bg-gradient-to-br from-rose-500 to-yellow-500'>
                            {subject}
                        </SingleSubject>
                    ))}
                    {topics.filter(t => !selected.includes(t)).map((subject, index) => (
                        <SingleSubject key={index} onClick={() => click(subject)}>
                            {subject}
                        </SingleSubject>
                    ))}
                </div>
            </div>

        </div>
    );
}