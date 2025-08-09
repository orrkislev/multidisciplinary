'use client'

import { aiConfig } from '../utils/ai-config';
import { useEffect, useState } from 'react';
import { tw } from '@/utils/tw';


const Term = tw`border rounded-lg p-2 transition-all duration-300 cursor-pointer hover:bg-opacity-50 hover:text-black text-uppercase font-markazi text-lg
    ${props => props.selected ? ' text-black ' : ''}
`;

export default function Terminology() {
    const terminology = aiConfig.terminology.store((state) => state.data);
    if (!terminology) return null;

    return (
        <div className='p-4 rounded-lg flex flex-col gap-4 divide-y bg-white'>
            <TerminologyGroup
                title="Fundamental Concepts"
                terms={terminology.concepts}
            />
            <TerminologyGroup
                title="Methodologies"
                terms={terminology.methodologies}
            />
            <TerminologyGroup
                title="Technical Terms"
                terms={terminology.technicalTerms}
            />
        </div>
    );
}



function TerminologyGroup({ title, terms }) {
    const [selected, setSelected] = useState({ name: '', definition: '' });
    const onClick = (term) => {
        setSelected(term);
    };

    useEffect(() => {
        if (terms && terms.length > 0) setSelected(terms[0]);
    }, [terms]);
    if (!terms) return null;
    if (terms.length === 0) return null;

    return (
        <div className='flex flex-col gap-2 pt-4'>
            <div className='font-markazi text-2xl font-bold'>{title}:</div>

            <div className='flex gap-2 flex-wrap w-full px-2'>
                {terms.map((term, index) => (
                    <Term key={index} onClick={() => onClick(term)} selected={selected.term === term.term}>
                        <div className='text-xl'>{term.term}</div>
                        {selected.term === term.term && (
                            <div className="text-italic leading-[.9em]">
                                {selected.definition || selected.process}
                                {selected.example}
                            </div>
                        )}
                    </Term>
                ))}
            </div>


        </div>
    );
}