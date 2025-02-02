'use client'

import { aiConfig } from '@/utils/ai-config';


export default function Questions() {
    const names = aiConfig.names.store((state) => state.data);
    const questions = aiConfig.questions.store((state) => state.data);

    if (!names || !questions) return null;

    return (
        <div>
            <div><strong>Questions to ask in the field of {name[0]}</strong></div>
            {questions?.map((question, index) => (
                <div key={index} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                    {question}
                </div>
            ))}
        </div>
    )
}