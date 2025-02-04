import { experimental_useObject as useObject } from 'ai/react';
import { vibeSchema } from '@/utils/vibe-config';
import { useEffect } from 'react';

export function VibeGen({ vibe }) {
    const { object, submit } = useObject({
        api: '/api/vibe',
        schema: vibeSchema,
        onFinish: (object, error) => {
            console.log(object, error);
        }
    });

    useEffect(()=>{
        if (vibe) submit({ vibe });
    },[vibe]);

    if (!vibe) return null

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
        <div className="w-full flex flex-col items-center mt-6">
            {/* Themes block with skeleton */}
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

            {/* Quests block with per-question skeletons */}
            {object.quests ? (
                <div className="flex gap-4 justify-center">
                    {object.quests.map((quest, index) => (
                        <div
                            key={index}
                            className="group relative border rounded p-4 w-72 flex flex-col overflow-hidden"
                        >
                            {quest.title ? (
                                <small>{quest.title}</small>
                            ) : (
                                <small className="animate-pulse bg-gray-300 inline-block w-3/4 h-4 rounded">Loading...</small>
                            )}
                            {quest.hook ? (
                                <div className="text-xl">
                                    <div className="text-lg text-blue-800 leading-tight mb-2">
                                        {quest.hook.fact}
                                    </div>
                                    <div>{quest.hook.question}</div>
                                </div>
                            ) : (
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                </div>
                            )}
                            {/* Hidden details to display on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition duration-300 mt-2 flex flex-col gap-4">
                                <div>
                                    <small className="text-gray-500">path</small>
                                    {quest.path ? (
                                        <ul className="list-disc list-inside">
                                            {quest.path.map((step, i) => (
                                                <li key={i}>{step}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <ul className="list-disc list-inside animate-pulse">
                                            <li className="bg-gray-300 rounded w-3/4 h-3 mb-1"></li>
                                            <li className="bg-gray-300 rounded w-1/2 h-3"></li>
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <small className="text-gray-500">outcome</small>
                                    {quest.outcome ? (
                                        <p className="italic text-green-600 border border-green-300 p-2 rounded">
                                            {quest.outcome}
                                        </p>
                                    ) : (
                                        <p className="italic bg-gray-300 border border-gray-300 p-2 rounded animate-pulse h-8"></p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex gap-4 justify-center">
                    {/* Fallback skeleton for entire quests section */}
                    <div className="border rounded p-4 w-72 flex flex-col animate-pulse">
                        <small className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></small>
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    </div>
                    <div className="border rounded p-4 w-72 flex flex-col animate-pulse">
                        <small className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></small>
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    </div>
                    <div className="border rounded p-4 w-72 flex flex-col animate-pulse">
                        <small className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></small>
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    </div>
                </div>
            )}
        </div>
    )
}