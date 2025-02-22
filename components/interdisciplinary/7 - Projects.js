'use client'

import { aiConfig } from "@/utils/ai-config";

export default function Projects() {
    const projects = aiConfig.projects.store((state) => state.data);

    const content = projects || []

    return (
        <div>
            <h2>Suggested Projects</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {content.map((project, index) => (
                    <div key={index} className="bg-gray-100 p-2 text-black rounded-lg">
                        <div className='mb-4'><span className="font-sans text-xl">{project.name}</span></div>
                        <p><strong>Tools:</strong> {project.tools && project.tools.join(', ')}</p>
                        <p><strong>Learning Path:</strong> {project.learningPath}</p>
                        <p><strong>Cross-Disciplinary Skill:</strong> {project.crossDisciplinarySkill}</p>
                        <p><strong>Safety Note:</strong> {project.safetyNote}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}