'use client'

import { aiConfig } from '@/utils/ai-config';
import { useEffect, useState } from 'react';
import { tw } from '@/utils/tw';


const Term = tw`bg-slate-300 p-2 text-black transition-all duration-300 cursor-pointer hover:bg-slate-100 text-uppercase font-mono text-xs
    ${props => props.selected ? 'bg-slate-500 text-white' : ''}
`;

export default function Terminology() {
    const names = aiConfig.names.store((state) => state.data);
    const terminology = aiConfig.terminology.store((state) => state.data);

    const [selected, setSelected] = useState({ name: '', definition: '' });
    const [type, setType] = useState('concepts');
    const [userSelected, setUserSelected] = useState(false);

    useEffect(() => {
        if (userSelected) return;
        if (!terminology || !terminology.concepts) return;
        const timeout = setTimeout(() => {
            const allOptions = [];
            if (terminology.concepts) allOptions.push(...terminology.concepts);
            if (terminology.methodologies) allOptions.push(...terminology.methodologies);
            if (terminology.technicalTerms) allOptions.push(...terminology.technicalTerms);
            setSelected(allOptions[Math.floor(Math.random() * allOptions.length)]);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [userSelected, selected, terminology]);

    const select = (term, termType) => {
        setType(termType);
        setSelected(term);
        setUserSelected(true);
    };

    return (
        <div className='bg-gray-100 p-4 rounded-lg flex flex-col gap-4'>
            <div>
                <div className="text-uppercase font-mono font-bold">
                    {type} - {selected.term || selected.name}
                </div>
                <div className="text-italic text-lg">
                    {selected.definition}
                </div>
            </div>
            <div>
                Fundamental Concepts:
                <div className='flex gap-2 flex-wrap w-full'>
                    {terminology?.concepts && terminology.concepts.map((term, index) => (
                        <Term 
                          key={index} 
                          onClick={() => select(term, 'Concept')}
                          selected={selected.term ? selected.term === term.term : false}
                        >
                            {term.term}
                        </Term>
                    ))}
                </div>
            </div>
            <div>
                Methodologies:
                <div className='flex gap-2 flex-wrap w-full'>
                    {terminology?.methodologies?.map((term, index) => (
                        <Term key={index} onClick={() => select(term,'Methodology')} selected={selected.name === term.name}>
                            {term.name}
                        </Term>
                    ))}
                </div>
            </div>
            <div>
                Technical Terms:
                <div className='flex gap-2 flex-wrap w-full'>
                    {terminology?.technicalTerms && terminology.technicalTerms.map((term, index) => (
                        <Term 
                          key={index} 
                          onClick={() => select(term, 'Technical Term')}
                          selected={selected.term ? selected.term === term.term : false}
                        >
                            {term.term}
                        </Term>
                    ))}
                </div>
            </div>
        </div>
    );
}

