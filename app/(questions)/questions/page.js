'use client'

import { experimental_useObject as useObject } from 'ai/react';
import { useEffect, useRef, useState } from "react"
import { Topics } from './TopicArea';
import { QuestionsArchive } from './QuestionArchive';
import { TopicSchema, InitialSchema } from "../schema"
import { AnimatePresence, motion } from 'framer-motion';
import Sources from './Sources';


export default function QuestionsPage() {
    const [questionsArchive, setQuestionsArchive] = useState([])
    const [topics, setTopics] = useState([null, null])
    const previousTopics = useRef([])
    const depth = useRef(0)

    const ai = useObject({
        api: '/api/questions', schema: TopicSchema,
        onFinish: ({ object }) => {
            setTopics(prev => [object, prev[0]])
            previousTopics.current.push(object)
            depth.current++
        }
    });
    const initialTheme = useRef(null)
    const themeAI = useObject({
        api: '/api/theme', schema: InitialSchema,
        onFinish: ({ object }) => {
            setTopics(prev => [{ theme: initialTheme.current, questions: object.questions }, prev[0]])
            previousTopics.current.push(object)
        }
    });

    useEffect(() => {
        if (questionsArchive.length == 0) return
        ai.submit({
            previousThemes: previousTopics.current.map(t => t.theme),
            currentTheme: topics[0],
            selectedQuestion: questionsArchive[questionsArchive.length - 1]
        })
    }, [questionsArchive])

    return (
        <div className="relative h-screen w-screen bg-orange-200 overflow-hidden">
            <AnimatePresence>
                {!initialTheme.current && (
                    <motion.div className="flex flex-col items-center justify-center h-screen gap-2"
                        exit={{ opacity: 0, y: -Math.random() * 20, x: Math.random() * 20 - 10, rotate: Math.random() * 20 - 10 }}
                        transition={{ duration: 1 }}
                    >
                        <input
                            className="p-3 rounded-md text-center bg-white/50 border-none outline-none rtl"
                            type="text"
                            placeholder="איזה נושא מענין אותך?"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    initialTheme.current = e.target.value
                                    themeAI.submit({ currentTheme: e.target.value })
                                }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            < QuestionsArchive questions={questionsArchive} />
            <Topics topics={topics} onSelect={(question) => setQuestionsArchive([...questionsArchive, question])} />
            <Sources topic={topics[0]} />
        </div>
    )
}