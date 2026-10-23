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
        <div className='flex-1 max-w-80 flex flex-col justify-between paper knead overflow-hidden aspect-[5/7] relative group/card animate-fade-in'>
            <CardImage prompt={card.imagePrompt} />

            <p className="font-mono text-[0.65rem] uppercase tracking-wider bg-paper px-3 py-1 rounded-full absolute top-3 left-[50%] -translate-x-[50%]">{card.type}</p>

            <form onSubmit={handleSubmit} className='flex flex-col justify-between gap-4 p-4 h-full'>
                <div className="p-2 flex flex-col gap-2">
                    <AutoSizeTextarea value={content} onFinish={setContent} className='text-base font-medium leading-snug rounded-xl px-1 hover:bg-stone focus:bg-stone outline-none transition-colors' />
                    <AutoSizeTextarea value={content2} onFinish={setContent2} className='text-sm text-ink-soft leading-snug rounded-xl px-1 hover:bg-stone focus:bg-stone outline-none transition-colors' />
                </div>
                <button aria-label="Add to project" className="pebble-btn w-full group/button" type='submit'>
                    <Plus className='w-4 h-4 group-hover/button:rotate-90 transition-transform duration-500' />
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
            className={`w-full h-auto resize-none whitespace-pre-wrap ${className}`}
            onChange={onChange}
        />
    )
}