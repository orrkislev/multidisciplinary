'use client'

import { tw } from '@/utils/tw';
import { useAiData } from '@/utils/useAI';
import { useState } from 'react';

export default function Terminology() {
    const name = useAiData(state => state.name);
    const terminology = useAiData(state => state.terminology);

    return (
        <div>
            <div><strong>Key Terminology in the field of {name}</strong></div>
            Concepts:
            <div className='flex gap-2 flex-wrap w-full'>
                {terminology?.concepts?.map((term, index) => (
                    <Term key={index} termData={term} />
                ))}
            </div>
            Methodologies:
            <div className='flex gap-2 flex-wrap w-full'>
                {terminology?.methodologies?.map((term, index) => (
                    <Term key={index} termData={term} />
                ))}
            </div>
            Technical Terms:
            <div className='flex gap-2 flex-wrap w-full'>
                {terminology?.technicalTerms?.map((term, index) => (
                    <Term key={index} termData={term} />
                ))}
            </div>
        </div>
    )
}

const TermDiv = tw`bg-gray-100 p-2 text-black rounded-lg cursor-pointer hover:bg-gray-200`

function Term({ termData }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <TermDiv onClick={() => setIsOpen(!isOpen)}>
            <div className='flex justify-between items-center' >
                {termData.name}
            </div>
            {isOpen && (
                <p>{termData.definition}</p>
            )}
        </TermDiv>
    )
}