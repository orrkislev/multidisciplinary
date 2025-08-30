import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { tw } from "@/utils/tw";

const animateTransition = {
    type: "spring",
    stiffness: 50,
    damping: 8
}

export function Topics({ topics, onSelect }) {
    const [offsets, setOffsets] = useState({
        new: { offsetx: 0, offsety: 0 },
        old: { offsetx: 0, offsety: 0 }
    })

    useEffect(() => {
        const rotation = Math.random() * Math.PI * 2
        const offsetx = window.innerWidth * 0.75 * Math.cos(rotation)
        const offsety = window.innerHeight * 0.75 * Math.sin(rotation)
        setOffsets(prev => ({
            new: { offsetx, offsety },
            old: prev.new
        }))
    }, [topics])

    if (!topics) return null

    return (
        <>
            <BG offsetx={offsets.new.offsetx} offsety={offsets.new.offsety} />
            {topics[0] && <TopicArea key={topics[0].theme} theme={topics[0].theme} questions={topics[0].questions} onSelect={onSelect} inOut={"in"} offsetx={offsets.new.offsetx} offsety={offsets.new.offsety} />}
            {topics[1] && <TopicArea key={topics[1].theme} theme={topics[1].theme} questions={topics[1].questions} onSelect={onSelect} inOut={"out"} offsetx={offsets.old.offsetx} offsety={offsets.old.offsety} />}
        </>
    )
}

export default function TopicArea({ theme, questions, onSelect, inOut, offsetx, offsety }) {
    if (!theme || theme === "") return null

    const prop = {}
    if (inOut === "in") {
        prop.initial = { x: offsetx, y: offsety, opacity: 0 }
        prop.animate = { x: 0, y: 0, opacity: 1 }
    } else {
        prop.animate = { x: -offsetx, y: -offsety, opacity: 0 }
    }
    prop.transition = animateTransition

    return (
        <motion.div className={`absolute top-1/2 left-1/2 z-10`} {...prop}
            style={{
                pointerEvents: inOut === "in" ? "auto" : "none"
            }}
        >
            <div className="flex flex-col items-center justify-center gap-2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-2xl font-bold text-center">{theme}</div>

                {/* {questionsAI.isLoading && (
                    <>
                        <div className="w-[50vw] h-16 rounded-md bg-white/50 animate-pulse"></div>
                        <div className="w-[50vw] h-16 rounded-md bg-white/50 animate-pulse"></div>
                        <div className="w-[50vw] h-16 rounded-md bg-white/50 animate-pulse"></div>
                    </>
                )} */}

                {/* {questionsAI.object && <Questions questions={questionsAI.object.questions} onSelect={onSelect} />} */}
                {questions && <Questions questions={questions} onSelect={onSelect} />}
            </div>
        </motion.div>
    )
}


function Questions({ questions, onSelect }) {
    return (
        <div className="flex flex-col gap-4 w-[90vw] md:w-[45vw]">
            {questions.map((question, index) => (
                <Question key={index} question={question} onSelect={onSelect} />
            ))}
        </div>
    )
}

const QuestionDiv = tw`rtl text-right relative p-2 rounded-lg cursor-pointer 
    hover:bg-white/50 transition-all group/question
    ${props => props.selected ? 'bg-white scale-105' : 'bg-black/20'}
`

function Question({ question, onSelect }) {
    const [selected, setSelected] = useState(false)
    return (
        <QuestionDiv selected={selected} onClick={() => {
            setSelected(!selected)
            onSelect(question)
        }}>
            <div className="text-xl pl-2 group-hover/question:text-gray-700">
                {question}
            </div>
        </QuestionDiv>
    )
}


function BG({ offsetx, offsety }) {
    const data = useMemo(() => {
        const data = []
        for (let i = 0; i < 25; i++) {
            data.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                z: Math.random() * 100
            })
        }
        return data
    }, [])

    const calculatedData = useMemo(() => {
        return data.map((item) => {
            const parallaxFactor = item.z / 100
            return {
                ...item,
                offsetx: offsetx * parallaxFactor,
                offsety: offsety * parallaxFactor
            }
        })
    }, [data, offsetx, offsety])

    return (
        <div className="absolute top-0 left-0 z-1">
            {calculatedData.map((item, index) => (
                <motion.div key={index}
                    className="absolute w-10 h-10 bg-white/20 rounded-full"
                    animate={{
                        x: item.offsetx,
                        y: item.offsety
                    }}
                    transition={animateTransition}
                    style={{
                        scale: 1 - (item.z / 100),
                        left: item.x,
                        top: item.y
                    }}
                />
            ))}
        </div>
    )
}

