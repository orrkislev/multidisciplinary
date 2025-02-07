'use client'

import { aiConfig } from "@/utils/ai-config";

export default function Timeline() {
    const timeline = aiConfig.timeline.store
        ? aiConfig.timeline.store((state) => state.data)
        : null;

    const content = timeline

    if (!content) return null

    if (!Array.isArray(content.past)) content.past = [];
    if (!Array.isArray(content.present)) content.present = [];
    if (!content.future) content.future = { year: '', scenario: '', probability: '' };

    return (
        <div>
            <div>
                <h3>Past Milestones</h3>
                {content.past.map((milestone, index) => (
                    <div key={`past-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        <p><strong>{milestone.year}</strong>: {milestone.event} - {milestone.influence}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>Current Developments</h3>
                {content.present.map((current, index) => (
                    <div key={`present-${index}`} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                        <p>{current.project} @ {current.organization}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>Future Projection</h3>
                <div className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                    <p>
                        <strong>{content.future.year}</strong>: {content.future.scenario} ({content.future.probability})
                    </p>
                </div>˝
            </div>
        </div>
    );
}