import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export function QuestionsArchive({ questions }) {
    if (questions.length == 0) return null
    return (
        <div className="hidden md:block">
            <div className="fixed top-4 left-4 z-30 flex flex-col gap-1 bg-paper/10 backdrop-blur-md text-paper p-3 rounded-[1.5rem] divide-y divide-paper/15 max-w-[260px]">
                {questions.map((question, index) => (
                    <ArchiveQuestion key={index} question={question} index={index} />
                ))}
            </div>
        </div>
    )
}

function ArchiveQuestion({ question }) {
    const ref = useRef(null)
    useGSAP(() => {
        gsap.from(ref.current, {
            x: '30',
            opacity: 0,
            duration: .25,
            ease: "bounce.out",
        })
    }, { scope: ref })
    return (
        <div ref={ref} className="text-xs text-right rtl p-2 group">
            {question}
        </div>
    )
}