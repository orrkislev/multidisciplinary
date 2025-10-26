'use client'

import { useData } from '../utils/store';
import { useEffect, useState } from 'react';
import { tw } from '@/utils/tw';
import { BookOpen, Brackets, Brain, Workflow } from 'lucide-react';


const TermButton = tw`rounded-lg p-1 px-2 transition-all duration-300 cursor-pointer hover:bg-opacity-50 hover:text-black uppercase font-markazi text-sm 
    ${props => props.selected ? ' bg-primary-800 text-primary-100 hover:bg-primary-800 hover:text-primary-100 cursor-default ' : 'bg-transparent border border-neutral-300'}
`;

export default function Terminology() {
    const currentMerge = useData(state => state.getActiveMerge());
    const terminology = currentMerge?.terminology;
    const hasTwoSubjects = currentMerge?.subjects?.length >= 2;

    return (
        <div id="terminology" className={`flex flex-col gap-8 ${hasTwoSubjects && 'card'}`}>
            {hasTwoSubjects && (
                <>
                    <TerminologyGroup
                        title="Fundamental Concepts"
                        Icon={BookOpen}
                        terms={terminology?.concepts}
                    />
                    <TerminologyGroup
                        title="Methodologies"
                        Icon={Workflow}
                        terms={terminology?.methodologies}
                    />
                    <TerminologyGroup
                        title="Technical Terms"
                        Icon={Brackets}
                        terms={terminology?.technicalTerms}
                    />
                </>
            )}
        </div>
    );
}



function TerminologyGroup({ title, Icon, terms }) {
    const [selected, setSelected] = useState({ name: '', definition: '' });
    const onClick = (term) => {
        setSelected(term);
    };

    useEffect(() => {
        if (terms && terms.length > 0) setSelected(terms[0]);
    }, [terms]);

    return (
        <div className='flex flex-col gap-2'>
            <div className='card-title mb-0 flex gap-2 items-center'>
                <Icon className='w-4 h-4' />
                {title}:
            </div>

            <div className='flex gap-2 flex-wrap w-full px-2'>
                {terms ? terms.map((term, index) => (
                    <TermButton key={index} onClick={() => onClick(term)} selected={selected.term === term.term}>
                        <div className=''>{term.term}</div>
                    </TermButton>
                )) : <div className="animate-pulse delay-300 bg-gray-200 rounded-md text-transparent">{Array(30).fill('blah').join(' ')}</div>}
                {selected.term && (
                    <div className="card-description text-sm">
                        {selected.definition || selected.process}
                        {selected.example}
                    </div>
                )}
            </div>


        </div>
    );
}