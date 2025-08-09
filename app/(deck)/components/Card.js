"use client";
import { useEffect, useRef, useState } from 'react';
import CardImage from './CardImage';
import { Plus } from 'lucide-react';

export default function Card({ onSubmit, card }) {
    const [content, setContent] = useState(card.content);
    const [content2, setContent2] = useState(card.content2);

    useEffect(()=>{
        setContent(card.content)
        setContent2(card.content2)
    },[card])

    if (!card.content || !card.content2 || !card.imagePrompt || !card.type) return null;


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ type: card.type, content: content + ' -> ' + content2 });
    }

    return (
        <div className='flex-1 flex flex-col justify-between bg-white overflow-hidden rounded-xl aspect-[5/7] relative group/card'>
            <CardImage prompt={card.imagePrompt} />

            <p className="font-mono text-xs bg-white px-2 py-1 absolute top-0 left-[50%] -translate-x-[50%]">{card.type}</p>

            <form onSubmit={handleSubmit} className='flex flex-col justify-between gap-4 p-4 h-full'>
                <div className="p-2 flex flex-col gap-2">
                    <AutoSizeTextarea value={content} onFinish={setContent} className='text-sm group-hover/card:border rounded-md transition-all' />
                    <AutoSizeTextarea value={content2} onFinish={setContent2} className='text-xs group-hover/card:border rounded-md transition-all' />
                </div>
                <button className="mb-2 px-3 py-1 bg-red-200 rounded flex items-center justify-center hover:bg-red-300 transition-all duration-300 group/button" type='submit'>
                    <Plus className='w-4 h-4 text-red-500 group-hover/button:text-red-700 group-hover/button:rotate-90 transition-all duration-300' />
                </button>
            </form>

        </div >
    );
}

export function AutoSizeTextarea({ value, onFinish, className }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = ref.current.scrollHeight + 'px';
        }
    }, [value]);

    const onChange = (e) => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = ref.current.scrollHeight + 'px';
        }
    }

    return (
        <textarea ref={ref}
            defaultValue={value}
            onBlur={(e) => onFinish(e.target.value)}
            className={`w-full h-auto resize-none whitespace-pre-wrap leading-4 ${className}`}
            onChange={onChange}
        />
    )
}