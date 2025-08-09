'use client'

import { aiConfig } from '../utils/ai-config';

export default function Questions() {
    const questions = aiConfig.questions.store((state) => state.data);

    if (!questions) return null

    const content = questions

    if (!Array.isArray(content.conceptual)) content.conceptual = [];
    if (!Array.isArray(content.ethical)) content.ethical = [];
    if (!Array.isArray(content.futuristic)) content.futuristic = [];
    
    return (
        <div className='p-4 rounded-lg flex flex-col gap-4 divide-y bg-white'>
            <div>
                <h3 className='font-markazi text-2xl font-bold'>Conceptual Questions</h3>
                {content.conceptual.map((q, index) => (
                    <div key={`conceptual-${index}`} className="p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
            <div>
                <h3 className='font-markazi text-2xl font-bold'>Ethical Dilemma Questions</h3>
                {content.ethical.map((q, index) => (
                    <div key={`ethical-${index}`} className="p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
            <div>
                <h3 className='font-markazi text-2xl font-bold'>Future Implication Questions</h3>
                {content.futuristic.map((q, index) => (
                    <div key={`futuristic-${index}`} className="p-2 my-2 text-black rounded-lg">
                        {q}
                    </div>
                ))}
            </div>
        </div>
    )
}