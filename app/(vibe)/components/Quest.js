'use client'

import { useState } from "react";

export default function Quest({ quest }) {
    if (!quest) {
        return (
            <div className="paper p-6 w-72 flex flex-col overflow-hidden">
                <div className="shimmer h-6 w-[60%] mb-3"></div>
                <div className="shimmer h-16 mb-8"></div>
                <div className="shimmer h-2 w-[40%] mb-2"></div>
                <div className="shimmer h-4 mb-2"></div>
            </div>
        )
    }

    if (window.innerWidth < 768)
        return <QuestMobile quest={quest} />
    return <QuestDesktop quest={quest} />
}

function QuestDesktop({ quest }) {
    return (
        <div className='group paper knead p-6 w-72 flex flex-col overflow-hidden animate-fade-in'>
            {quest.title && <div className="display text-2xl mb-4">{quest.title}</div> }

            {quest.hook && (
                <div className="text-lg leading-snug font-medium">
                    <div className="text-base text-pink leading-snug mb-2">
                        {quest.hook.fact}
                    </div>
                    <div>{quest.hook.question}</div>
                </div>
            )}

            <div className="opacity-25 group-hover:opacity-100 transition duration-500 mt-4 flex flex-col gap-4">
                <div>
                    <small className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft">path</small>
                    {quest.path && (
                        <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                            {quest.path.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <small className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft">outcome</small>
                    {quest.outcome && (
                        <p className="text-sm mt-1 bg-pink-pale rounded-2xl px-3 py-2">
                            {quest.outcome}
                        </p>
                    )}
                </div>
                {quest.resources?.length > 0 && (
                    <div>
                        <small className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft">read</small>
                        <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                            {quest.resources.map((r, i) => (
                                <li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="underline">{r.title}</a></li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}

function QuestMobile({ quest }) {
    const [expanded, setExpanded] = useState(false);



    return (
        <div
            onClick={() => setExpanded(prev => !prev)}
            className={`group paper p-5 w-72 flex flex-col overflow-hidden transition-all duration-300 ${expanded ? 'cursor-default max-h-screen' : 'max-h-40 cursor-pointer'} transition-all duration-300`}
        >
            {quest.title && <small>{quest.title}</small>}

            {quest.hook && (
                <div className="text-lg leading-snug font-medium">
                    <div className="text-base text-pink leading-snug mb-2">
                        {quest.hook.fact}
                    </div>
                    <div>{quest.hook.question}</div>
                </div>
            )}

            {expanded && (
                <div className="mt-2 flex flex-col gap-4">
                    <div>
                        <small className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft">path</small>
                        {quest.path && (
                            <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                                {quest.path.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <small className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft">outcome</small>
                        {quest.outcome && (
                            <p className="text-sm mt-1 bg-pink-pale rounded-2xl px-3 py-2">
                                {quest.outcome}
                            </p>
                        )}
                    </div>
                {quest.resources?.length > 0 && (
                    <div>
                        <small className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft">read</small>
                        <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                            {quest.resources.map((r, i) => (
                                <li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="underline">{r.title}</a></li>
                            ))}
                        </ul>
                    </div>
                )}
                </div>
            )}
        </div>
    );
}