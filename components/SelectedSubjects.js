'use client'

import { useEffect, useState } from "react";
import { SingleSubject } from "./Subjects";

export default function SelectedSubjects({ subject1, subject2 }) {
    const [names, setNames] = useState(null);

    useEffect(() => {
        if (subject1 && subject2) {
            fetch('/api/name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'name', subject1, subject2 })
            }).then(res => res.json())
                .then(data => {
                    setNames(data.names);
                })
        } else {
            setNames(null);
        }
    }, [subject1, subject2])

    const pickName = (name) => {
        const newNames = [name, ...names.filter(n => n !== name).sort(() => Math.random() - 0.5)];
        setNames(newNames);
    }

    return (
        <div className='flex flex-col gap-4 px-16 py-2'>
            <div className='flex flex-row gap-4' >
                <SubjectCard subject1={subject1} subject2={subject2} names={names} />
                <div className="bg-gray-100 p-4">
                    <SubjectDescription name={names && names[0]} subject1={subject1} subject2={subject2} />
                    {names && (
                        <div className='flex gap-2 flex-wrap mt-8'>
                            {names.slice(1).map((name, index) => (
                                <SingleSubject key={index} onClick={() => pickName(name)}>{name}</SingleSubject>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <SubjectProjects subject1={subject1} subject2={subject2} name={names && names[0]} />
        </div>
    )
}

function SubjectCard({ subject1, subject2, names }) {
    const subjectTop = `font-cylburn font-bold text-3xl leading-[1em] text-left z-10`;
    const subjectBottom = `font-cylburn font-bold text-3xl leading-[1em] text-right z-10`;
    const mainName = `font-magilio tracking-wide font-bold text-6xl leading-[1em] text-center z-10`

    const bgStyle = {
        backgroundImage: `url(https://picsum.photos/400/700)`,
        filter: 'saturate(0.5) brightness(0.5)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }

    return (
        <div className="text-center p-4 rounded-lg relative text-white bg-gray-400 flex flex-col justify-between relative p-4 gap-8">
            <div className='absolute z-0 inset-0 rounded-lg' style={bgStyle} />
            {subject1 && <div className={subjectTop}>{subject1}</div>}
            {names && <div className={mainName}>{names[0]}</div>}
            {subject2 && <div className={subjectBottom}>{subject2}</div>}
        </div >
    )
}

function SubjectDescription({ name, subject1, subject2 }) {
    const [text, setText] = useState(null);

    useEffect(() => {
        setText(null);
        if (!name) return;

        fetch('/api/name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'description', subject1, subject2, name })
        }).then(res => res.json())
            .then(data => {
                setText(data.text);
            })
    }, [name])

    return (
        <p className="text-lg text-gray-800">{text}</p>
    )
}

function SubjectProjects({ subject1, subject2, name }) {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects([]);
        if (!name) return;

        console.log('requesting projects')
        fetch('/api/name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'projects', subject1, subject2, name })
        }).then(res => res.json())
            .then(data => {
                setProjects(data.projects.projects)
            })
    }, [name])

    return (
        <div>
            {projects.map((project, index) => (
                <div key={index} className="bg-gray-100 p-2 my-2 text-black">
                    <h2 className="text-xl font-bold">{project.name}</h2>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    )
}