'use client'

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getSourcesAction } from '../actions/getSources';


export default function Sources({ topic }) {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState(null)

    useEffect(() => {
        if (topic) getSourcesAction(topic).then(setData)
    }, [topic])

    if (!data) return null

    return (
        <div className={`rtl text-right fixed bottom-2 pt-8 right-2 z-50 bg-white/50 p-4 rounded-md divide-y divide-gray-200 max-w-[250px] text-xs ${isOpen ? 'max-h-[500px]' : 'max-h-[50px]'} transition-all duration-300`}>
            <button className="absolute top-2 right-2" onClick={() => setIsOpen(!isOpen)}>
                {!isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div className="overflow-y-auto">
                <h1 className="font-bold">{data.overview}</h1>
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold">מי עוד חוקר את זה?</h2>
                    <ul className="list-disc list-inside mt-2">
                        {data.who.map((who, index) => (
                            <li key={index}>{who}</li>
                        ))}
                    </ul>
                    <h2 className="font-bold">איפה ללמוד עוד?</h2>
                    <ul className="list-disc list-inside mt-2">
                        {data.where.map((where, index) => (
                            <li key={index}>{where}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}