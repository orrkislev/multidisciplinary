import { experimental_useObject as useObject } from 'ai/react';
import { vibeSchema } from '@/utils/vibe-config';
import { useEffect, useState } from 'react';
import Quest from './Quest';

export function VibeGen({ vibe }) {
    const { object, submit } = useObject({
        api: '/api/vibe',
        schema: vibeSchema,
        onFinish: (object, error) => {}
    });

    useEffect(() => {
        if (vibe) submit({ vibe });
    }, [vibe]);

    if (!vibe) return null;

    if (!object) {
        return (
            <div className="flex flex-wrap justify-center mb-4 animate-pulse">
                <span className="bg-gray-300 text-gray-300 px-3 py-1 rounded-full m-1">Loading</span>
                <span className="bg-gray-300 text-gray-300 px-3 py-1 rounded-full m-1">Loading</span>
                <span className="bg-gray-300 text-gray-300 px-3 py-1 rounded-full m-1">Loading</span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center mt-6 font-geist">
            {/* Themes block */}
            {object.themes ? (
                <div className="flex flex-wrap justify-center mb-4">
                    {object.themes.map((theme, i) => (
                        <span key={i} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full m-1">
                            {theme}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center mb-4 animate-pulse">
                    <span className="bg-gray-300 text-gray-300 px-3 py-1 rounded-full m-1">Loading</span>
                    <span className="bg-gray-300 text-gray-300 px-3 py-1 rounded-full m-1">Loading</span>
                    <span className="bg-gray-300 text-gray-300 px-3 py-1 rounded-full m-1">Loading</span>
                </div>
            )}

            {/* Updated Quests block */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Quest quest={object.quests ? object.quests[0] : null} />
                <Quest quest={object.quests ? object.quests[1] : null} />
                <Quest quest={object.quests ? object.quests[2] : null} />
            </div>

        </div>
    )
}