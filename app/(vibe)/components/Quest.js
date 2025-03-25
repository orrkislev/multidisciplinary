'use client'

import { useState } from "react";

export default function Quest({ quest }) {
    if (!quest) {
        return (
            <div className="border rounded p-4 w-72 flex flex-col overflow-hidden transition-all duration-300 animate-pulse">
                <div className="h-6 w-[60%] bg-gray-300 rounded mb-2"></div>
                <div className="h-16 bg-gray-300 rounded mb-8"></div>
                <div className="h-2 w-[40%] bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
            </div>
        )
    }

    if (window.innerWidth < 768)
        return <QuestMobile quest={quest} />
    return <QuestDesktop quest={quest} />
}

function QuestDesktop({ quest }) {
    return (
        <div className='group border rounded p-4 w-72 flex flex-col overflow-hidden transition-all duration-300 hover:bg-white'>
            {quest.title && <div className="font-bold text-xl mb-4 text-center">{quest.title}</div> }

            {quest.hook && (
                <div className="text-xl">
                    <div className="text-lg text-blue-800 leading-tight mb-2">
                        {quest.hook.fact}
                    </div>
                    <div>{quest.hook.question}</div>
                </div>
            )}

            <div className="opacity-20 group-hover:opacity-100 transition duration-300 mt-2 flex flex-col gap-4">
                <div>
                    <small className="text-gray-500">path</small>
                    {quest.path && (
                        <ul className="list-disc list-inside">
                            {quest.path.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <small className="text-gray-500">outcome</small>
                    {quest.outcome && (
                        <p className="italic text-green-600 border border-green-300 p-2 rounded">
                            {quest.outcome}
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
}

function QuestMobile({ quest }) {
    const [expanded, setExpanded] = useState(false);



    return (
        <div
            onClick={() => setExpanded(prev => !prev)}
            className={`group border rounded p-4 w-72 flex flex-col overflow-hidden transition-all duration-300 ${expanded ? 'cursor-default max-h-screen' : 'max-h-40 cursor-pointer'} transition-all duration-300`}
        >
            {quest.title && <small>{quest.title}</small>}

            {quest.hook && (
                <div className="text-xl">
                    <div className="text-lg text-blue-800 leading-tight mb-2">
                        {quest.hook.fact}
                    </div>
                    <div>{quest.hook.question}</div>
                </div>
            )}

            {expanded && (
                <div className="mt-2 flex flex-col gap-4">
                    <div>
                        <small className="text-gray-500">path</small>
                        {quest.path && (
                            <ul className="list-disc list-inside">
                                {quest.path.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <small className="text-gray-500">outcome</small>
                        {quest.outcome && (
                            <p className="italic text-green-600 border border-green-300 p-2 rounded">
                                {quest.outcome}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}