'use client'

import { ExternalLink, HelpCircle } from 'lucide-react';
import { useData } from '../utils/store';

export default function Questions() {
    const currentMerge = useData(state => state.getActiveMerge());
    const questions = currentMerge?.questions;
    const hasTwoSubjects = currentMerge?.subjects?.length >= 2;

    return (
        <div id="questions" className={`flex flex-col gap-4 ${hasTwoSubjects && 'card'}`}>
            {hasTwoSubjects && (
                <>
                    <QuestionGroup title="Conceptual Questions" questions={questions?.conceptual} />
                    <QuestionGroup title="Ethical Dilemma Questions" questions={questions?.ethical} />
                    <QuestionGroup title="Future Implication Questions" questions={questions?.futuristic} />
                </>
            )}
        </div >
    )
}

function QuestionGroup({ title, questions }) {
    return (
        <div className="flex flex-col gap-2">
            <h3 className='card-title'>{title}</h3>
            {questions ? questions.map((q, index) => (
                <SingleQuestion key={`${title}-${index}`} question={q} />
            )) : <div className="animate-pulse delay-300 bg-gray-200 rounded-md text-transparent">{Array(30).fill('blah').join(' ')}</div>}
        </div>
    )
}

function SingleQuestion({ question }) {

    // https://www.perplexity.ai/search?q=YOUR_QUERY
    const url = `https://www.perplexity.ai/search?q=${encodeURIComponent(question)}`

    return (
        <div className="card-description flex gap-2 text-sm hover:bg-primary-200 transition-all duration-300 rounded-lg p-2 group">
            <HelpCircle className='w-6 h-6' />
            {question}
            <a href={url} target="_blank">
                <div className="rounded-full opacity-10 group-hover:opacity-100 hover:bg-primary-500 transition-all duration-300 p-1">
                    <ExternalLink className='w-4 h-4' />
                </div>
            </a>
        </div>
    )
}