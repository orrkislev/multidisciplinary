'use client'

import { experimental_useObject as useObject } from 'ai/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { namesSchema } from '@/utils/Schema'
import { subjects } from '@/utils/topics'

export default function Sidebar({ a, b, onSlot }) {
    // the slot the next pick fills: the first empty one, otherwise whichever was chosen last
    const [target, setTarget] = useState('a')
    const [input, setInput] = useState('')
    const [shuffled, setShuffled] = useState(subjects)
    const inputRef = useRef(null)
    const ai = useObject({ api: '/api/subjects', schema: namesSchema })

    useEffect(() => { setShuffled([...subjects].sort(() => Math.random() - 0.5)) }, [])

    useEffect(() => {
        if (!a) setTarget('a')
        else if (!b) setTarget('b')
    }, [a, b])

    // ask the model for related subjects once typing pauses
    useEffect(() => {
        if (input.trim().length < 2) return
        const t = setTimeout(() => ai.submit({ input: input.trim() }), 450)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input])

    const pick = (subject) => {
        onSlot(target, subject)
        setInput('')
    }

    const chooseSlot = (slot) => {
        setTarget(slot)
        inputRef.current?.focus()
    }

    const q = input.trim().toLowerCase()
    const matches = q ? shuffled.filter(s => s.toLowerCase().includes(q)) : shuffled
    const suggested = q.length >= 2 ? (ai.object?.subjects || []).filter(Boolean) : []
    const options = [...new Set([...suggested, ...matches])].filter(s => s !== a && s !== b)

    return (
        <aside className="md:w-64 shrink-0 bg-stone-deep/60 md:h-dvh md:sticky md:top-0 flex flex-col border-b md:border-b-0 md:border-r border-ink/10 max-h-[50dvh] md:max-h-none">
            <Link href="/" className="group flex items-center gap-2 px-5 pt-5 pb-3">
                <img src="/cutouts/brain.webp" alt="" className="h-7 w-auto transition-transform duration-500 ease-squish group-hover:scale-x-125 group-hover:scale-y-75" />
                <span className="display text-xl">Interdisciplinary</span>
            </Link>

            <div className="flex items-center gap-1.5 px-4 pb-3">
                <Slot value={a} active={target === 'a'} onClick={() => chooseSlot('a')} placeholder="First subject" />
                <span className="display text-xl text-pink">×</span>
                <Slot value={b} active={target === 'b'} onClick={() => chooseSlot('b')} placeholder="Second subject" />
            </div>

            <div className="flex flex-col min-h-0 flex-1 px-4 pb-4">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && input.trim() && pick(input.trim())}
                    placeholder="Type any subject…"
                    className="field text-sm w-full"
                />
                <ul className="mt-3 overflow-y-auto flex-1 -mx-1">
                    {input.trim() && (
                        <li>
                            <button onClick={() => pick(input.trim())} className="w-full text-left px-3 py-1.5 rounded-full text-sm hover:bg-paper cursor-pointer">
                                Use <strong>{input.trim()}</strong>
                            </button>
                        </li>
                    )}
                    {options.map(s => (
                        <li key={s}>
                            <button
                                onClick={() => pick(s)}
                                className={`w-full text-left px-3 py-1.5 rounded-full text-sm transition-transform duration-300 ease-squish hover:bg-paper hover:translate-x-1 cursor-pointer ${suggested.includes(s) ? 'text-pink' : ''}`}
                            >
                                {s}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}

function Slot({ value, active, onClick, placeholder }) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={`knead flex-1 min-w-0 truncate rounded-full px-3 py-2 text-sm text-center cursor-pointer
                ${active ? 'bg-ink text-paper' : value ? 'bg-paper shadow-[0_0_0_1px_rgb(36_32_30/0.2)]' : 'bg-paper/50 text-ink-soft italic'}`}
        >
            {value || placeholder}
        </button>
    )
}
