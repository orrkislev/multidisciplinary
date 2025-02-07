'use client'

import { aiConfig } from '@/utils/ai-config';

export default function Questions() {
    const questions = aiConfig.questions.store((state) => state.data);

    if (!questions) return null

    const content = questions

    if (!Array.isArray(content.conceptual)) content.conceptual = [];
    if (!Array.isArray(content.ethical)) content.ethical = [];
    if (!Array.isArray(content.futuristic)) content.futuristic = [];
    
    return (
        <div>
            <div>
                <h3>Conceptual Questions</h3>
                {content.conceptual.map((q, index) => (
                    <div key={`conceptual-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
            <div>
                <h3>Ethical Dilemma Questions</h3>
                {content.ethical.map((q, index) => (
                    <div key={`ethical-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
            <div>
                <h3>Future Implication Questions</h3>
                {content.futuristic.map((q, index) => (
                    <div key={`futuristic-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
        </div>
    )
}