import { experimental_useObject as useObject } from 'ai/react';
import { vibeSchema } from '@/utils/vibe-config';
import { useEffect } from 'react';
import Quest from './Quest';

export function VibeGen({ vibe, type}) {
    const { object, submit } = useObject({
        api: '/api/vibe',
        schema: vibeSchema,
    });

    useEffect(() => {
        if (type == 'emojis') {
            submit({ emojis: vibe });
        } else if (type == 'image') {
            submit({ image: vibe });
        } else if (type == 'text') {
            submit({ vibe });
        }
    }, [vibe, type]);

    if (!vibe) return null;

    if (!object) {
        return (
            <div className="flex flex-wrap justify-center mb-4 mt-12">
                <span className="shimmer !rounded-full px-4 py-1.5 m-1">Loading theme</span>
                <span className="shimmer !rounded-full px-4 py-1.5 m-1">Loading theme</span>
                <span className="shimmer !rounded-full px-4 py-1.5 m-1">Loading theme</span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center mt-12">
            {/* Themes block */}
            {object.themes ? (
                <div className="flex flex-wrap justify-center mb-4">
                    {object.themes.map((theme, i) => (
                        <span key={i} className="animate-fade-in bg-paper px-4 py-1.5 rounded-full m-1 text-sm" style={{ animationDelay: `${i * 80}ms` }}>
                            {theme}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center mb-4 mt-12">
                    <span className="shimmer !rounded-full px-4 py-1.5 m-1">Loading theme</span>
                    <span className="shimmer !rounded-full px-4 py-1.5 m-1">Loading theme</span>
                    <span className="shimmer !rounded-full px-4 py-1.5 m-1">Loading theme</span>
                </div>
            )}

            {/* Updated Quests block */}
            <div className="flex flex-col md:flex-row gap-5 justify-center items-start mt-4">
                <Quest quest={object.quests ? object.quests[0] : null} />
                <Quest quest={object.quests ? object.quests[1] : null} />
                <Quest quest={object.quests ? object.quests[2] : null} />
            </div>

        </div>
    )
}