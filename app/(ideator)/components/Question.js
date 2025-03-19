import { isHebrew } from "@/utils/utils";
import { useIdeator } from "./useIdeatorAI";
export default function Questions({ question, i }) {
    const questions = useIdeator(state => state.questions);

    return (
        <div className="flex justify-between gap-4">
            {Array.isArray(questions) && questions.map((question, i) => (
                <Question key={i} question={question} i={i} />
            ))}
        </div>
    )
}

function Question({ question, i }) {
    const hasHebrewContent = isHebrew(question);
    return (
        <div key={i} className="p-2 rounded-lg text-sm border-2 border-dashed border-white">
            <div className={`${hasHebrewContent ? 'rtl text-right' : ''}`}>{question}</div>
        </div>
    )
}