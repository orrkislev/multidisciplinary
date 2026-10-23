'use client'

import { experimental_useObject as useObject } from 'ai/react'
import { Plus, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { fusionKey, fusionSchema } from '../fusion'
import Article from './Article'
import Sidebar from './SideBar'

const CACHE = 'interdisciplinary:articles:v3'
const TABS = 'interdisciplinary:tabs'
const MAX_SAVED = 30

// Storage can be missing or full (private windows, quotas); the page works without it.
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { } }
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export default function Fusion() {
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [tabs, setTabs] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [cached, setCached] = useState(null)
    const [names, setNames] = useState({}) // fusionKey -> name, for tab titles
    const streaming = useRef(null) // the [a, b] the current stream belongs to

    const active = tabs.find(t => t.id === activeId)
    const a = active?.a || ''
    const b = active?.b || ''

    const { object, submit, isLoading, stop, error } = useObject({
        api: '/api/fusion',
        schema: fusionSchema,
        onFinish: ({ object }) => {
            if (!object || !streaming.current) return
            const key = fusionKey(...streaming.current)
            const saved = read(CACHE, {})
            saved[key] = object
            const keys = Object.keys(saved)
            keys.slice(0, Math.max(0, keys.length - MAX_SAVED)).forEach(k => delete saved[k])
            write(CACHE, saved)
            setNames(n => ({ ...n, [key]: object.name }))
        },
    })

    // restore tabs, then let a shared link (?a=&b=) open or select its own tab
    useEffect(() => {
        let saved = read(TABS, [])
        const urlA = params.get('a') || '', urlB = params.get('b') || ''
        let id = saved[0]?.id
        if (urlA || urlB) {
            const match = saved.find(t => t.a === urlA && t.b === urlB)
            if (match) id = match.id
            else { const tab = { id: newId(), a: urlA, b: urlB }; saved = [...saved, tab]; id = tab.id }
        }
        if (!saved.length) { const tab = { id: newId(), a: '', b: '' }; saved = [tab]; id = tab.id }
        setTabs(saved)
        setActiveId(id)
        setNames(Object.fromEntries(Object.entries(read(CACHE, {})).map(([k, v]) => [k, v.name])))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => { if (tabs.length) write(TABS, tabs) }, [tabs])

    // the URL mirrors the active tab so it can be shared
    useEffect(() => {
        if (!activeId) return
        const q = new URLSearchParams()
        if (a) q.set('a', a)
        if (b) q.set('b', b)
        router.replace(`${pathname}${q.size ? `?${q}` : ''}`, { scroll: false })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId, a, b])

    const generate = () => {
        streaming.current = [a, b]
        submit({ subjects: [a, b] })
    }

    useEffect(() => {
        stop()
        streaming.current = null
        if (!a || !b) { setCached(null); return }
        const hit = read(CACHE, {})[fusionKey(a, b)]
        if (hit) { setCached(hit); return }
        setCached(null)
        generate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [a, b])

    const updateActive = (changes) => setTabs(ts => ts.map(t => (t.id === activeId ? { ...t, ...changes } : t)))

    // Fill one slot; picking the subject already in the other slot clears that slot
    const setSlot = (slot, value) => {
        const other = slot === 'a' ? 'b' : 'a'
        updateActive({ [slot]: value, ...(active?.[other] === value && { [other]: '' }) })
    }

    const openTab = (nextA = '', nextB = '') => {
        const existing = nextA && tabs.find(t => fusionKey(t.a, t.b) === fusionKey(nextA, nextB))
        if (existing) { setActiveId(existing.id); return }
        const tab = { id: newId(), a: nextA, b: nextB }
        setTabs(ts => [...ts, tab])
        setActiveId(tab.id)
    }

    const closeTab = (id) => {
        const i = tabs.findIndex(t => t.id === id)
        const rest = tabs.filter(t => t.id !== id)
        if (!rest.length) return
        setTabs(rest)
        if (id === activeId) setActiveId(rest[Math.min(i, rest.length - 1)].id)
    }

    const article = a && b ? cached || object : null
    const titleOf = (t) => (t.id === activeId && article?.name) || names[fusionKey(t.a, t.b)] || (t.a && t.b ? `${t.a} × ${t.b}` : t.a || 'New')

    return (
        <div className="flex flex-col md:flex-row min-h-dvh bg-stone">
            <Sidebar a={a} b={b} onSlot={setSlot} />
            <main className="flex-1 min-w-0">
                <nav className="sticky top-0 z-30 bg-stone/90 backdrop-blur flex items-center gap-1.5 overflow-x-auto px-5 md:px-12 xl:px-16 pt-4 pb-3">
                    {tabs.map(t => (
                        <div
                            key={t.id}
                            className={`group/tab shrink-0 flex items-center rounded-full text-sm transition-colors ${t.id === activeId ? 'bg-ink text-paper' : 'bg-paper/70 hover:bg-paper'}`}
                        >
                            <button onClick={() => setActiveId(t.id)} className={`pl-4 py-1.5 max-w-56 truncate cursor-pointer ${tabs.length > 1 ? 'pr-1' : 'pr-4'}`}>
                                {titleOf(t)}
                            </button>
                            {tabs.length > 1 && (
                                <button onClick={() => closeTab(t.id)} aria-label="Close tab" className="pr-2.5 pl-1 py-1.5 opacity-40 hover:opacity-100 hover:text-pink cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button onClick={() => openTab()} aria-label="New tab" className="knead shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-paper/70 hover:bg-paper hover:text-pink cursor-pointer group/plus">
                        <Plus className="w-4 h-4 transition-transform duration-500 ease-squish group-hover/plus:rotate-90" />
                    </button>
                </nav>

                <div className="pl-5 md:pl-12 xl:pl-16 pr-5 md:pr-6 pt-6 pb-28">
                    {activeId && (
                        <Article
                            key={`${activeId}:${fusionKey(a, b)}`}
                            a={a}
                            b={b}
                            article={article}
                            loading={!cached && isLoading}
                            error={!cached && !isLoading && error}
                            onRetry={generate}
                            onPair={(x, y) => updateActive({ a: x, b: y })}
                            onSeeAlso={openTab}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}
