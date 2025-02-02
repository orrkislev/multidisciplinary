'use client'

import { aiConfig } from "@/utils/ai-config";

export default function Projects() {
    const names = aiConfig.names.store((state) => state.data);
    const projects = aiConfig.projects.store((state) => state.data);

    if (!names || !projects) return null;

    return (
        <div>
            <div><strong>Suggested Project in the field of {names[0]}</strong></div>
            <div className='grid grid-cols-4 gap-4'>
                {projects?.map((project, index) => (
                    <div key={index} className="bg-gray-100 p-2 text-black rounded-lg">
                        <div className='mb-4'>{project.emoji} <span className="font-sans text-xl">{project.name}</span></div>
                        <p>{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}