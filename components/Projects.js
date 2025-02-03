'use client'

import { aiConfig } from "@/utils/ai-config";

export default function Projects() {
    const names = aiConfig.names.store((state) => state.data);
    const projectsStore = aiConfig.projects.store((state) => state.data);

    if (!names || !projectsStore || !projectsStore.projects) return null;

    return (
        <div>
            <div><strong>Suggested Project in the field of {names[0]}</strong></div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {projectsStore.projects.map((project, index) => (
                    <div key={index} className="bg-gray-100 p-2 text-black rounded-lg">
                        <div className='mb-4'><span className="font-sans text-xl">{project.name}</span></div>
                        <p><strong>Tools:</strong> {project.tools && project.tools.join(', ')}</p>
                        <p><strong>Cross-Disciplinary Skill:</strong> {project.crossDisciplinarySkill}</p>
                        <p><strong>Safety Note:</strong> {project.safetyNote}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}