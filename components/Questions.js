'use client'

import { useAiData } from '@/utils/useAI';


export default function Questions() {
    const name = useAiData(state => state.name);
    const questions = useAiData(state => state.questions);

    return (
        <div>
            <div><strong>Questions to ask in the field of {name}</strong></div>
            {questions?.map((question, index) => (
                <div key={index} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                    {question}
                </div>
            ))}
        </div>
    )
}