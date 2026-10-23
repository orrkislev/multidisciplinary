'use client'

import React, { useEffect, useRef, useState } from "react"
import { QuestionsArchive } from './QuestionArchive';
import { AnimatePresence, motion } from 'framer-motion';
import EndlessCanvas, { EndlessCanvasProvider, useEndlessCanvas } from './EndlessCanvas';
import { getQuestionsAction } from '../actions/getQuestions';
import { getThemeAction } from '../actions/getTheme';
import { poissonNext } from '../poisson';
import { Info, RefreshCcw } from 'lucide-react';
import { getSourcesAction } from '../actions/getSources';
import { createPortal } from "react-dom";
import HomeButton from "@/app/(__components)/HomeButton";

export default function QuestionsPageWrapper() {
    return (
        <EndlessCanvasProvider>
            <QuestionsPage />
            <HomeButton />
        </EndlessCanvasProvider>
    )
}


function QuestionsPage() {
    const [topics, setTopics] = useState([])
    const [questionsArchive, setQuestionsArchive] = useState([])
    const { setTarget } = useEndlessCanvas()

    useEffect(() => {
        setTarget({ x: 300, y: window.innerHeight / 4 })
    }, [])

    const addNewTopic = (topic) => {
        const allPoints = topics.map(t => t.position)
        const newPoint = poissonNext(allPoints, Math.max(window.innerWidth / 2, window.innerHeight / 2))
        setTopics([...topics, { topic, position: newPoint }])
        setTarget({ x: newPoint[0] + window.innerWidth / 4, y: newPoint[1] + window.innerHeight / 4 })
    }

    const onSelectQuestion = async (question) => {
        setQuestionsArchive([...questionsArchive, question])
        const theme = await getThemeAction(topics, topics[topics.length - 1].topic, question)
        addNewTopic(theme)
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <EndlessCanvas>
                {topics.length === 0 && (
                    <InitialInput onSubmit={(value) => addNewTopic(value)} />
                )}
                {topics.map((topic, index) => (
                    <TopicArea key={index} topic={topic.topic} position={topic.position} onSelect={onSelectQuestion} />
                ))}
            </EndlessCanvas>

            <QuestionsArchive questions={questionsArchive} />
        </div>
    )
}

const placeholders = [
    "Cryptozoology",
    "Mandela Effect",
    "Synchronicity",
    "Bioluminescence",
    "Psychoacoustics",
    "Neuroaesthetics",
    "Archaeoastronomy",
    "Lucid Dreams",
    "Ball Lightning",
    "Chaos Theory",
    "UFOs",
    "Geomancy",
    "Sleepwalking",
    "Astrobiology",
    "Prions",
    "Cosmic Consciousness",
    "Telepathy",
    "Spectroscopy",
    "Semiotics",
    "Micropaleontology"
]

function InitialInput({ onSubmit }) {
    const [placeholder, setPlaceholder] = useState("")

    useEffect(() => {
        setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)])
        const interval = setInterval(() => {
            setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)])
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute top-0 left-0 flex flex-col items-center justify-center gap-8 rounded-lg w-[90vw] md:w-[45vw]">
            <div className="display text-4xl md:text-5xl text-center text-paper">What topic interests you?</div>
            <input className="field text-center w-80"
                style={{ outline: '14px solid #F1EFEB' }}
                type="text"
                placeholder={placeholder}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSubmit(e.target.value)
                    }
                }} />
        </div>
    )
}

function TopicArea({ topic, position, onSelect }) {
    const [questions, setQuestions] = useState(null)
    const [hovered, setHovered] = useState(false)
    const topicRef = useRef(null)

    useEffect(() => {
        getQuestions()
    }, [topic])

    const getQuestions = async () => {
        setQuestions(null)
        const questions = await getQuestionsAction(topic)
        setQuestions(questions.split('\n').map(q => q.trim()).filter(q => q !== '').map(q => ({ question: q, selected: false })))
    }

    return (
        <>
            <div ref={topicRef} className="group/topic absolute flex flex-col gap-4 items-center justify-center md:max-w-[70vw] w-[90vw]" style={{ left: `${position[0]}px`, top: `${position[1]}px` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-transparent bg-transparent topic-bg">
                    <div className="flex items-center justify-center mb-4 gap-8">
                        <div className="display text-3xl text-center rounded-md p-2 topic-bg-item">{topic}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        {Array(3).fill(0).map((_, index) => (
                            <div key={index} className={`p-2 px-4 rounded-full text-center ${hovered === index ? 'scale-105' : ''} transition-all duration-300 topic-bg-item`}>
                                {questions ? questions[index].question : '...'}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {questions && (
                        <>
                            <SourcesButton topic={topic} topicRef={topicRef} />
                            <RefreshCcw className={`absolute top-2 left-2 w-0 h-0 cursor-pointer rounded-full hover:bg-paper p-2 hover:scale-125 opacity-0 group-hover/topic:opacity-100 group-hover/topic:w-8 group-hover/topic:h-8 transition-all duration-200 ${!questions && 'opacity-30'}`}
                                onClick={() => questions && getQuestions(true)} />
                        </>
                    )}

                    <div className="flex items-center justify-center mb-4 gap-10">
                        <div className="display text-3xl text-center rounded-md p-2 text-ink">{topic}</div>

                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        {Array(3).fill(0).map((_, index) => (
                            <div key={index}
                                className={`p-2 px-5 rounded-full text-center transition-all duration-500 ease-squish
                            ${(questions && questions[index]?.selected) ? 'bg-stone-deep' : 'bg-paper hover:scale-x-105 hover:scale-y-95 cursor-pointer'}`}
                                onMouseEnter={() => setHovered(index)}
                                onMouseLeave={() => setHovered(false)}
                                onClick={() => {
                                    if (!questions || questions[index]?.selected) return
                                    setQuestions(questions.map((q, i) => ({ ...q, selected: i === index ? !q.selected : q.selected })))
                                    onSelect(questions[index].question)
                                }}
                            >
                                {questions ? questions[index].question : '...'}
                            </div>
                        ))}
                    </div>
                </div>

                <svg width="0" height="0">
                    <filter id="fancy-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </svg>

                <style jsx>{`
                    .topic-bg {
                        filter: url(#fancy-goo) drop-shadow(0 18px 30px rgba(0,0,0,0.35));
                    }
                    .topic-bg-item {
                        background-color: #F1EFEB;
                        outline: 15px solid #F1EFEB;
                    }
            `}</style>
            </div >
            <OutOfRangeArrow topicRef={topicRef} topic={topic} />
        </>
    )
}

function OutOfRangeArrow({ topicRef, topic }) {
    const { pos, setTarget } = useEndlessCanvas()

    if (!topicRef.current) return null

    const bounds = topicRef.current.firstChild.getBoundingClientRect()
    let directionX = null
    let directionY = null
    if (bounds.right < 0) directionX = 'left'
    if (bounds.left > window.innerWidth) directionX = 'right'
    if (bounds.bottom < 0) directionY = 'top'
    if (bounds.top > window.innerHeight) directionY = 'bottom'

    if (!directionX && !directionY) return null

    let style = {}
    if (directionX === 'left') style.left = '10px'
    else if (directionX === 'right') style.right = '10px'
    else style.left = bounds.left + bounds.width / 2

    if (directionY === 'top') style.top = '10px'
    else if (directionY === 'bottom') style.bottom = '10px'
    else style.top = bounds.top + bounds.height / 2

    return <div className="fixed z-40 px-5 py-3 bg-stone-pale rounded-full text-center cursor-pointer knead display text-sm"
        style={style}
        onClick={() => setTarget({ x: topicRef.current.style.left.replace('px', ''), y: topicRef.current.style.top.replace('px', '') })}>
        {topic}
    </div>
}

function SourcesButton({ topic, topicRef }) {
    const [sources, setSources] = useState(null)
    const [showSources, setShowSources] = useState(false)

    useEffect(() => {
        const getSources = async () => {
            const sources = await getSourcesAction(topic)
            setSources(sources)
        }
        getSources()
    }, [topic])



    return (
        <>
            <Info className={`absolute top-2 right-2  w-0 h-0 cursor-pointer rounded-full hover:bg-paper p-2 hover:scale-125 opacity-0 group-hover/topic:opacity-100 group-hover/topic:w-8 group-hover/topic:h-8 transition-all duration-200 ${!sources && 'opacity-30'}`}
                onClick={() => sources && setShowSources(!showSources)} />
            {createPortal((
                <AnimatePresence>
                    {showSources && (
                        <motion.div className="fixed top-0 left-0 right-0 bottom-0 bg-ink/60 backdrop-blur-sm z-50 cursor-pointer flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setShowSources(false)}
                        >
                            <motion.div className="paper p-7 max-w-[500px] flex flex-col gap-4 leading-relaxed"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <h1 className="text-lg font-medium">{sources.overview}</h1>
                                <div className="flex flex-col gap-2">
                                    <h2 className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft">Who studies this topic?</h2>
                                    <ul className="list-disc list-inside mt-2">
                                        {sources.who.map((who, index) => (
                                            <li key={index}>{who}</li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            ), document.body)}
        </>
    )

}
