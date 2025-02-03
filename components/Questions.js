'use client'

import { aiConfig } from '@/utils/ai-config';

export default function Questions() {
    const names = aiConfig.names.store((state) => state.data);
    const questions = aiConfig.questions.store((state) => state.data);

    if (!names || !questions) return null;

    return (
        <div>
            <div>
                <strong>Questions to ask in the field of {names[0]}</strong>
            </div>
            <div>
                <h3>Conceptual Questions</h3>
                {questions.conceptual && questions.conceptual.map((q, index) => (
                    <div key={`conceptual-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
            <div>
                <h3>Ethical Dilemma Questions</h3>
                {questions.ethical && questions.ethical.map((q, index) => (
                    <div key={`ethical-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
            <div>
                <h3>Future Implication Questions</h3>
                {questions.futuristic && questions.futuristic.map((q, index) => (
                    <div key={`futuristic-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
        </div>
    )
}