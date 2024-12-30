'use client'

import { useAiData } from '@/utils/useAI';


export default function Projects() {
    const name = useAiData(state => state.name);
    const projects = useAiData(state => state.projects);

    return (
        <div>
            <strong>Suggested Project in the field of {name}</strong>
            {projects?.map((project, index) => (
                <div key={index} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                    {project.emoji} <span className="font-sans text-xl">{project.name}</span>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    )
}