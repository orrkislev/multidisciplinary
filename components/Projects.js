'use client'

import { useAiData } from '@/utils/useAI';


export default function Projects() {
    const name = useAiData(state => state.name);
    const projects = useAiData(state => state.projects);

    return (
        <div>
            <div><strong>Suggested Project in the field of {name}</strong></div>
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