'use client'

import { useEffect, useState } from "react";
import { SingleSubject } from "./Subjects";
import { experimental_useObject as useObject } from 'ai/react';
import { descriptionSchema, linksSchema, namesSchema, projectsSchema } from "@/utils/AiData";

export default function SelectedSubjects({ subject1, subject2 }) {
    const { object, submit } = useObject({
        api: '/api/name',
        schema: namesSchema,
    });
    const [names, setNames] = useState(null);

    useEffect(() => {
        if (subject1 && subject2) {
            console.log('submitting')
            submit({ action: 'name', subject1, subject2 });
        } else {
            setNames(null);
        }
    }, [subject1, subject2])

    useEffect(() => {
        setNames(object?.subjects)
    }, [object])

    const pickName = (name) => {
        const newNames = [name, ...names.filter(n => n !== name).sort(() => Math.random() - 0.5)];
        setNames(newNames);
    }

    return (
        <div className='flex flex-col gap-4 px-4 py-2 h-[100vh] overflow-y-scroll'>
            <div className='flex flex-col gap-4' >
                <SubjectCard subject1={subject1} subject2={subject2} name={names && names[0]} />
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

function SubjectCard({ subject1, subject2, name }) {
    const [img, setImg] = useState(null);

    useEffect(() => {
        if (!name) return;
        fetch('/api/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject1, subject2, newName: name })
        })
            .then(res => res.json())
            .then(data => {
                setImg(data.image)
            })
    }, [name])

    const subjectTop = `font-cylburn font-bold text-3xl leading-[1em] text-left z-10`;
    const subjectBottom = `font-cylburn font-bold text-3xl leading-[1em] text-right z-10`;
    const mainName = `font-magilio tracking-wide font-bold text-6xl leading-[1em] text-center z-10`

    const bgStyle = {
        backgroundImage: `url(data:image/jpeg;base64,${img})`,
        filter: 'saturate(0.5) brightness(0.5)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }

    return (
        <div className="text-center p-4 rounded-lg relative text-white bg-gray-400 flex flex-col justify-between relative p-4 gap-8">
            <div className='absolute z-0 inset-0 rounded-lg' style={bgStyle} />
            {subject1 && <div className={subjectTop}>{subject1}</div>}
            {name && <div className={mainName}>{name}</div>}
            {subject2 && <div className={subjectBottom}>{subject2}</div>}
        </div >
    )
}

function SubjectDescription({ name, subject1, subject2 }) {
    const { object, submit } = useObject({ api: '/api/name', schema: descriptionSchema });

    useEffect(() => {
        if (!name) return;
        submit({ action: 'description', subject1, subject2, name });
    }, [name])

    return (
        <div className='flex flex-row justify-between gap-8'>
            <div className="rounded-lg">
                <h2 className="text-2xl font-bold">{object?.title}</h2>
                <h3 className="text-lg font-bold">{object?.subtitle}</h3>
                <p className="text-lg text-gray-800">{object?.description}</p>
            </div>
            <div className="rounded-lg border-white border-2 p-2 flex flex-col items-center justify-center">
                <p className="text-gray-800 italic font-sans text-center text-orange-800">{object?.funFact}</p>
            </div>
        </div>
    )
}

function SubjectProjects({ subject1, subject2, name }) {
    const { object, submit } = useObject({ api: '/api/name', schema: projectsSchema });

    useEffect(() => {
        if (!name) return;
        submit({ action: 'projects', subject1, subject2, name });
    }, [name])

    if (!object) return null

    return (
        <div>
            <strong>Suggested Project in the field of {name}</strong>
            {object?.projects?.map((project, index) => (
                <div key={index} className="bg-gray-100 p-2 my-2 text-black rounded-lg">
                    <h2 className="text-xl font-bold">{project.name}</h2>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    )
}