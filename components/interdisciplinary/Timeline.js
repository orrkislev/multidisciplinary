'use client'

import { aiConfig } from "@/utils/ai-config";

export default function Timeline() {
    const names = aiConfig.names.store((state) => state.data);
    const timeline = aiConfig.timeline.store 
        ? aiConfig.timeline.store((state) => state.data)
        : null;

    if (!names || !timeline) return null;

    return (
        <div>
            <div>
                <strong>Timeline for {names[0]}</strong>
            </div>
            <div>
                <h3>Past Milestones</h3>
                {timeline.past && timeline.past.map((milestone, index) => (
                    <div key={`past-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        <p><strong>{milestone.year}</strong>: {milestone.event} - {milestone.influence}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>Current Developments</h3>
                {timeline.present && timeline.present.map((current, index) => (
                    <div key={`present-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        <p>{current.project} @ {current.organization}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>Future Projection</h3>
                {timeline.future && (
                    <div className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        <p>
                            <strong>{timeline.future.year}</strong>: {timeline.future.scenario} ({timeline.future.probability})
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}