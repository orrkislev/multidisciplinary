'use client'

import { aiConfig } from "../utils/ai-config";

export default function Projects() {
    const projects = aiConfig.projects.store((state) => state.data);

    if (!projects) return null

    return (
        <div>
            <h2 className='text-xs text-gray-500 my-2'>Suggested Projects</h2>
            <div className='flex gap-4'>
                {projects.map((project, index) => (
                    <div key={index} className="p-2 text-black rounded-lg bg-white">
                        <div className='mb-4'><span className="font-sans text-xl">{project.name}</span></div>
                        <div className='mb-4'><span className="font-sans">{project.description}</span></div>
                        <p><strong>Cross-Disciplinary Skill:</strong> {project.crossDisciplinarySkills}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}