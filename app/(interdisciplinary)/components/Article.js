'use client'

import { useEffect, useRef, useState } from 'react'
import { subjects } from '@/utils/topics'
import { fusionKey } from '../fusion'

const PLATE_STYLE = 'Antique scientific plate engraving, fine black ink cross-hatching on warm cream paper, with a single hot pink accent. One centered subject with generous margins. No text, no letters, no labels, no plate number.'

const TERM_GROUPS = [['concepts', 'Concepts'], ['methods', 'Methods'], ['technical', 'Technical']]
const QUESTION_TYPES = [['conceptual', 'Conceptual'], ['ethical', 'Ethical'], ['future', 'Future']]

const search = q => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`

export default function Article({ a, b, article, loading, error, onRetry, onPair, onSeeAlso }) {
    const [term, setTerm] = useState(null) // the term open in the viewer
    const termsRef = useRef(null)

    if (!a || !b) return <Empty a={a} onPair={onPair} />

    const groups = TERM_GROUPS.map(([key, label]) => [label, (article?.terms?.[key] || []).filter(t => t?.term && t?.definition)])
    const terms = groups.flatMap(([, list]) => list)
    const questions = QUESTION_TYPES.map(([key, label]) => [label, article?.questions?.[key]]).filter(([, q]) => q)
    // fields stream in order, so once history starts the figure prompt is complete
    const figureReady = !!article?.figure?.prompt && (article?.history !== undefined || !loading)

    const openTerm = (name) => {
        setTerm(name)
        termsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return (
        <article>
            <header className="mb-10">
                <p className="display text-2xl md:text-3xl text-ink-soft mb-2">{a} <span className="text-pink">×</span> {b}</p>
                <h1 className="display text-[clamp(2.75rem,7vw,6.5rem)] hyphens-auto break-words">
                    {article?.name || <span className="shimmer inline-block w-[60%]">Naming</span>}
                </h1>
                {article?.subtitle && <p className="display italic text-2xl md:text-3xl text-ink-soft mt-3 animate-fade-in">{article.subtitle}</p>}
            </header>

            {error && (
                <div className="paper p-5 mb-10 max-w-xl flex items-center justify-between gap-4">
                    <p>The entry stopped before it was finished.</p>
                    <button onClick={onRetry} className="pebble-btn shrink-0">Try again</button>
                </div>
            )}

            <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem] gap-x-12 xl:gap-x-16 gap-y-10 items-start">
                <Infobox className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-20" a={a} b={b} article={article} figureReady={figureReady} />

                <div className="lg:col-start-1 lg:row-start-1 min-w-0 text-[1.075rem] leading-[1.7]">
                    <div className="max-w-[50rem]">
                        {article?.lead
                            ? article.lead.split(/\n\s*\n/).map((p, i) => <p key={i} className="mb-5 animate-fade-in"><Rich text={p} terms={terms} onOpen={openTerm} /></p>)
                            : <Placeholder lines={5} />}

                        {article?.didYouKnow && (
                            <p className="display italic text-2xl leading-snug border-l-4 border-pink pl-5 my-10 animate-fade-in">{article.didYouKnow}</p>
                        )}
                    </div>

                    <Section title="History" show={article?.history?.filter(h => h?.event && h?.year).length >= 2} loading={loading}>
                        <Timeline events={article?.history?.filter(h => h?.event && h?.year) || []} done={!loading} />
                    </Section>

                    <Section title="Key terms" show={terms.length} loading={loading}>
                        <div ref={termsRef}>
                            <TermViewer groups={groups} terms={terms} selected={term} onSelect={setTerm} />
                        </div>
                    </Section>

                    <Section title="Open questions" show={questions.length} loading={loading}>
                        <ul className="max-w-[50rem]">
                            {questions.map(([label, q]) => (
                                <li key={label} className="grid sm:grid-cols-[7rem_1fr] gap-x-6 gap-y-1 py-4 border-t border-ink/15 first:border-t-0 animate-fade-in">
                                    <span className="text-sm text-pink pt-1">{label}</span>
                                    <span className="display text-xl md:text-2xl leading-snug">{q}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Try it yourself" show={article?.projects?.length} loading={loading}>
                        <div className="grid sm:grid-cols-3 gap-5">
                            {article?.projects?.filter(p => p?.name).map((p, i) => (
                                <div key={i} className="paper p-4 animate-fade-in">
                                    <p className="text-xs text-pink">{p.scale}</p>
                                    <p className="display text-xl leading-tight mt-1 mb-2">{p.name}</p>
                                    <p className="text-sm leading-relaxed">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="See also" show={article?.seeAlso?.length} loading={loading}>
                        <div className="grid sm:grid-cols-3 gap-5">
                            {article?.seeAlso?.filter(s => s?.a && s?.b && s?.name).map((s, i) => (
                                <button key={i} onClick={() => onSeeAlso(s.a, s.b)} className="paper knead text-left p-4 cursor-pointer hover:shadow-[0_0_0_1.5px_#FF2D87] animate-fade-in">
                                    <span className="display block text-xl leading-tight">{s.name}</span>
                                    <span className="block text-sm text-ink-soft mt-1">{s.a} × {s.b}</span>
                                </button>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </article>
    )
}

function Section({ title, show, loading, children }) {
    if (!show && !loading) return null
    return (
        <section className="mt-14">
            <h2 className="display text-3xl md:text-4xl border-b border-ink/30 pb-2 mb-6">{title}</h2>
            {show ? children : <Placeholder lines={3} />}
        </section>
    )
}

function Placeholder({ lines }) {
    return (
        <div className="flex flex-col gap-2.5 mb-5 max-w-[50rem]" aria-hidden="true">
            {Array.from({ length: lines }, (_, i) => (
                <div key={i} className="shimmer h-4" style={{ width: `${i === lines - 1 ? 55 : 92 - (i % 3) * 6}%` }} />
            ))}
        </div>
    )
}

// Years placed to scale, nudged apart so close dates don't collide
function placeYears(years) {
    const min = Math.min(...years), span = Math.max(...years) - min || 1
    const pos = years.map(y => ((y - min) / span) * 100)
    const GAP = 12
    for (let i = 1; i < pos.length; i++) if (pos[i] - pos[i - 1] < GAP) pos[i] = pos[i - 1] + GAP
    const max = Math.max(...pos)
    return max > 100 ? pos.map(p => (p / max) * 100) : pos
}

function Timeline({ events, done }) {
    const [selected, setSelected] = useState(0)
    const [touched, setTouched] = useState(false)
    const sorted = [...events].sort((x, y) => x.year - y.year)
    const positions = placeYears(sorted.map(e => e.year))
    const current = sorted[Math.min(selected, sorted.length - 1)]

    // walk through the events by itself until someone takes over
    useEffect(() => {
        if (touched || !done || matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const t = setInterval(() => setSelected(s => (s + 1) % sorted.length), 4500)
        return () => clearInterval(t)
    }, [touched, done, sorted.length])

    const choose = i => { setTouched(true); setSelected(i) }

    return (
        <div
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'ArrowRight') choose(Math.min(sorted.length - 1, selected + 1))
                if (e.key === 'ArrowLeft') choose(Math.max(0, selected - 1))
            }}
            className="outline-none"
        >
            <div key={current.year + current.event} className="min-h-[7.5rem] max-w-[50rem] animate-fade-in">
                <p className="display text-5xl md:text-6xl text-pink leading-none">{current.year}</p>
                <p className="text-lg mt-3">{current.event}</p>
            </div>

            <div className="relative h-16 mt-6 mx-4">
                <div className="absolute top-[7px] left-0 right-0 h-px bg-ink/25" />
                <div className="absolute top-[6px] left-0 h-[3px] rounded-full bg-pink transition-all duration-700 ease-squish" style={{ width: `${positions[selected] ?? 0}%` }} />
                {sorted.map((e, i) => (
                    <button
                        key={i}
                        onMouseEnter={() => choose(i)}
                        onClick={() => choose(i)}
                        aria-label={`${e.year}: ${e.event}`}
                        className="group/year absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer"
                        style={{ left: `${positions[i]}%` }}
                    >
                        <span className={`block w-[15px] h-[15px] rounded-full transition-all duration-300 ease-squish ${i === selected ? 'bg-pink scale-125' : i < selected ? 'bg-pink/60' : 'bg-paper shadow-[inset_0_0_0_1.5px_rgb(36_32_30/0.5)] group-hover/year:scale-125'}`} />
                        <span className={`font-mono text-[0.7rem] mt-2 transition-colors ${i === selected ? 'text-ink' : 'text-ink-soft'}`}>{e.year}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function TermViewer({ groups, terms, selected, onSelect }) {
    const current = terms.find(t => t.term.toLowerCase() === selected?.toLowerCase()) || terms[0]
    return (
        <div className="paper grid sm:grid-cols-[16rem_minmax(0,1fr)] overflow-hidden">
            <div className="bg-stone-pale/70 border-b sm:border-b-0 sm:border-r border-ink/10 py-4">
                {groups.filter(([, list]) => list.length).map(([label, list]) => (
                    <div key={label} className="mb-3 last:mb-0">
                        <p className="px-5 text-xs text-ink-soft mb-1">{label}</p>
                        <ul>
                            {list.map(t => {
                                const on = t === current
                                return (
                                    <li key={t.term}>
                                        <button
                                            onMouseEnter={() => onSelect(t.term)}
                                            onFocus={() => onSelect(t.term)}
                                            onClick={() => onSelect(t.term)}
                                            className={`relative w-full text-left display text-lg leading-snug px-5 py-1.5 cursor-pointer transition-colors duration-200 ${on ? 'bg-paper text-pink sm:-mr-px' : 'hover:text-pink'}`}
                                        >
                                            {on && <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-pink" />}
                                            {t.term}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            <div key={current.term} className="p-6 md:p-10 self-center animate-fade-in">
                <p className="display text-4xl md:text-5xl leading-none">{current.term}</p>
                <p className="text-lg mt-4 leading-relaxed max-w-xl">{current.definition}</p>
            </div>
        </div>
    )
}

// Turns [[term]] markup into links that preview the term and open it in the viewer
function Rich({ text, terms, onOpen }) {
    const clean = text.replace(/\[\[[^\]]*$/, m => m.slice(2)) // half-streamed "[[ter"
    return clean.split(/\[\[([^\]]+)\]\]/g).map((part, i) => i % 2 ? <Term key={i} term={part} terms={terms} onOpen={onOpen} /> : part)
}

function Term({ term, terms, onOpen }) {
    const definition = terms.find(t => t.term.toLowerCase() === term.toLowerCase())?.definition
    return (
        <button
            onClick={() => definition && onOpen(term)}
            className="group/term relative inline font-medium underline decoration-pink decoration-2 underline-offset-[3px] hover:bg-pink-pale rounded-sm cursor-pointer"
        >
            {term}
            {definition && (
                <span
                    role="tooltip"
                    className="paper pointer-events-none absolute left-0 bottom-full mb-3 w-72 p-3 z-20 text-left text-sm leading-snug font-normal opacity-0 translate-y-1 transition duration-200 group-hover/term:opacity-100 group-hover/term:translate-y-0 group-focus-visible/term:opacity-100 group-focus-visible/term:translate-y-0"
                >
                    <span className="display block text-lg mb-1">{term}</span>
                    {definition}
                </span>
            )}
        </button>
    )
}

function Infobox({ className, a, b, article, figureReady }) {
    const info = article?.infobox
    const lookUp = info?.lookUp?.filter(Boolean)
    const rows = [
        ['Parents', `${a}, ${b}`],
        ['Key figure', info?.keyFigure],
        ['Methods', info?.methods?.filter(Boolean).join(' · ')],
        ['Look up', lookUp?.length > 0 && (
            <span className="flex flex-col">
                {lookUp.map(t => (
                    <a key={t} href={search(t)} target="_blank" rel="noreferrer" className="underline decoration-pink decoration-1 underline-offset-2 hover:text-pink">{t}</a>
                ))}
            </span>
        )],
    ]
    return (
        <aside className={`paper p-4 text-sm ${className}`}>
            <Figure k={fusionKey(a, b)} prompt={article?.figure?.prompt} caption={article?.figure?.caption} ready={figureReady} />
            <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 border-t border-ink/15 mt-4 pt-3">
                {rows.map(([label, value]) => (
                    <div key={label} className="contents">
                        <dt className="text-ink-soft">{label}</dt>
                        <dd className="leading-snug">{value || <span className="shimmer inline-block w-24 h-3.5" />}</dd>
                    </div>
                ))}
            </dl>
        </aside>
    )
}

// One generated plate per fusion, shared across remounts and React's double effects
const plates = new Map()
const getPlate = (key, prompt) => {
    if (!plates.has(key)) {
        plates.set(key, fetch('/api/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: `${prompt}. ${PLATE_STYLE}`, aspectRatio: '4:5' }),
        })
            .then(r => r.json())
            .then(j => {
                if (!j.image) throw new Error(j.error)
                return `data:${j.mimeType};base64,${j.image}`
            })
            .catch(e => { plates.delete(key); throw e }))
    }
    return plates.get(key)
}

function Figure({ k, prompt, caption, ready }) {
    const [src, setSrc] = useState(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        if (!ready) return
        let alive = true
        getPlate(k, prompt).then(url => alive && setSrc(url), () => alive && setFailed(true))
        return () => { alive = false }
    }, [k, prompt, ready])

    return (
        <figure>
            {src
                ? <img src={src} alt={caption || ''} className="w-full aspect-[4/5] object-cover rounded-sm animate-fade-in" />
                : <div className={`w-full aspect-[4/5] rounded-sm ${failed ? 'bg-stone-pale' : 'shimmer'}`} />}
            {caption && <figcaption className="text-xs italic text-ink-soft mt-2 leading-snug">{caption}</figcaption>}
        </figure>
    )
}

function Empty({ a, onPair }) {
    const [pairs, setPairs] = useState([])
    useEffect(() => {
        const pool = [...subjects].sort(() => Math.random() - 0.5)
        setPairs([[pool[0], pool[1]], [pool[2], pool[3]], [pool[4], pool[5]]])
    }, [])

    return (
        <div className="max-w-3xl pt-[8vh]">
            <h1 className="display text-[clamp(3rem,7vw,6rem)]">
                {a ? <>{a} <span className="text-pink">×</span> …</> : 'Pick two subjects.'}
            </h1>
            {!a && (
                <div className="flex flex-wrap gap-3 mt-10">
                    {pairs.map(([x, y]) => (
                        <button key={x + y} onClick={() => onPair(x, y)} className="pebble-btn-soft">
                            {x} <span className="text-pink">×</span> {y}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
