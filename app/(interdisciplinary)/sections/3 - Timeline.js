'use client'

import { useRef, useState } from "react";
import { useData } from "../utils/store";

export default function Timeline() {
    const currentMerge = useData(state => state.getActiveMerge());
    const hasTwoSubjects = currentMerge?.subjects?.length >= 2;

    return (
        <div id="timeline">
            {hasTwoSubjects && <TimelineContent timeline={currentMerge?.timeline} />}
        </div>
    )
}


function TimelineContent({ timeline }) {
    const timer = useRef(null)
    const [selectedYear, setSelectedYear] = useState([null, 'auto'])

    let allEvents = [], years = [];
    if (timeline) {
        // ----------------- Combine all events -------------------
        // ------------------------------------------------------------
        allEvents = [
            ...timeline.past.map(event => ({ ...event, type: 'past' })),
            ...timeline.present.map(event => ({ ...event, year: new Date().getFullYear(), type: 'present' })),
            { ...timeline.future, type: 'future' }
        ].sort((a, b) => a.year - b.year);


        // ----------------- Timeline Calculations -------------------
        // ------------------------------------------------------------
        years = Array.from(new Set(allEvents.map(e => e.year)));
        const startYear = Math.min(...years);
        const endYear = Math.max(...years);
        const timeSpan = endYear - startYear;
        const MIN_SPACING = 10; // Minimum percentage spacing between marks
        years = years.map(year => ({ year, position: ((year - startYear) / timeSpan) * 100 }))
        for (let i = 1; i < years.length; i++) {
            const gap = years[i].position - years[i - 1].position;
            if (gap < MIN_SPACING) {
                const needed = MIN_SPACING - gap;
                for (let j = i; j < years.length; j++) years[j].position += needed;
            }
        }
        const maxPosition = Math.max(...years.map(y => y.position));
        if (maxPosition > 100) {
            const scale = 100 / maxPosition;
            years.forEach(year => year.position *= scale);
        }

        // ----------------- Timer -------------------
        // ------------------------------------------------------------
        if (timer.current) clearTimeout(timer.current)
        if (!selectedYear[0]) setSelectedYear([years[Math.floor(Math.random() * years.length)].year, 'auto'])
        timer.current = setTimeout(() => {
            setSelectedYear([years[Math.floor(Math.random() * years.length)].year, 'auto'])
        }, selectedYear[1] === 'auto' ? 5000 : 10000)
    }

    return (
        <div className="w-full card">
            {/* Description Panel */}
            {selectedYear[0] ? (
                <div className="animate-fade-in mb-4 flex flex-col gap-2">
                    <div className="flex"><div className="text-sm p-1 px-2 rounded-full bg-primary-800 text-primary-100">{selectedYear[0]}</div></div>
                    {allEvents.filter(e => e.year === selectedYear[0]).map((event, index) => (
                        <div key={index}>
                            {event.type === 'past' && (
                                <>
                                    <div className="">{event.event}</div>
                                    <div className="text-sm"><strong>influence:</strong> {event.influence}</div>
                                </>
                            )}
                            {event.type === 'present' && (
                                <>
                                    <div className="">{event.project}</div>
                                    <div className="text-sm">({event.organization})</div>
                                </>
                            )}
                            {event.type === 'future' && (
                                <>
                                    <div className="">{event.scenario}</div>
                                    <div className="text-sm"><strong>probability:</strong> {event.probability}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mb-4 flex flex-col gap-2 text-transparent">
                    <div className="flex">
                        <div className="text-sm p-1 px-2 rounded-full bg-gray-200 animate-pulse">blah</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="animate-pulse delay-300 bg-gray-200 rounded-md">{Array(30).fill('blah').join(' ')}</div>
                        <div className="text-sm animate-pulse delay-400 bg-gray-200 rounded-md">{Array(30).fill('blah').join(' ')}</div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="relative ml-4 w-[calc(100%-4rem)]">
                {/* Timeline bar */}
                {timeline ? <div className="absolute w-full h-1 bg-primary-500 top-2"></div> : <div className="absolute w-full h-1 bg-gray-200 top-2 animate-pulse"></div>}

                {/* Timeline marks */}
                <div className="relative h-16">
                    {years.map((year, index) => (
                        <div
                            key={index}
                            className="absolute transform -translate-x-2"
                            style={{ left: `${year.position}%` }}
                        >
                            <button
                                onClick={() => setSelectedYear([year.year, 'manual'])}
                                className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${selectedYear[0] === year.year
                                    ? 'bg-primary-800'
                                    : 'bg-primary-500'
                                    }`}
                            />
                            <div className="absolute -rotate-45 origin-left mt-2 text-sm text-primary-600 whitespace-nowrap">
                                {year.year}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}