'use client'

import { useData } from "../utils/store";

export default function Projects() {
    const currentMerge = useData(state => state.getActiveMerge());
    const projects = currentMerge?.projects;

    const hasTwoSubjects = currentMerge?.subjects?.length >= 2;

    return (
        <div id="projects" className='flex gap-4'>
            {hasTwoSubjects && (
                <>
                    {projects ? projects.map((project, index) => (
                        <div key={index} className="card">
                            <div className='mb-4'><span className="card-title">{project.name}</span></div>
                            <div className='mb-4'><span className="font-sans">{project.description}</span></div>
                            <p><strong>Cross-Disciplinary Skill:</strong> {project.crossDisciplinarySkills}</p>
                        </div>
                    )) : Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse delay-300 bg-gray-200 rounded-md text-transparent">{Array(30).fill('blah').join(' ')}</div>
                    ))}
                </>
            )}
        </div>
    )
}