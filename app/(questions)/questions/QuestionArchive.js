import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

export function QuestionsArchive({ questions }) {
    if (questions.length == 0) return null
    return (
        <div className="display-none md:display-block">
            <div className="fixed top-2 left-2 flex flex-col gap-4 bg-white/50 p-4 rounded-md divide-y divide-gray-200 max-w-[250px]">
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