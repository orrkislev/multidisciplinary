'use client'

import { useEffect, useState } from "react";
import { SingleSubject } from "./Subjects";
import Projects from "./Projects";
import useAIManager from "@/utils/useAI";
import { aiConfig, useUserData } from "@/utils/ai-config";
import Terminology from "./Terminology";
import Questions from "./Questions";
import Quiz from "./Quiz";
import Timeline from "./Timeline";



export default function RightSide() {
    const { subject1, subject2 } = useUserData()
    const ai = useAIManager();
    const names = aiConfig.names.store((state) => state.data);

    const pickName = (newName) => {
        aiConfig.names.store.setState(state => ({
            ...state,
            data: [newName, ...(state.data || []).filter(n => n !== newName)]
        }));
    }

    if (!subject1 || !subject2) return null;
    if (!names || !names.names) return null;

    return (
        <div className="flex flex-col gap-4 px-4 py-2">
            <div className="flex flex-col gap-4">
                <SubjectCard />
                <div className="bg-gray-100 p-4 backdrop-blur-lg rounded-lg">
                    <SubjectDescription />
                    {names.names && (
                        <div className="flex gap-2 flex-wrap mt-8">
                            {names.names.slice(1).map((name, index) => (
                                <SingleSubject key={index} onClick={() => pickName(name)}>
                                    {name}
                                </SingleSubject>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Timeline />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Terminology />
                <Questions />
            </div>
            <Quiz />
            <Projects />
        </div>
    )
}

function SubjectCard() {
    const { subject1, subject2 } = useUserData();
    const names = aiConfig.names.store(state => state.data);
    const name = names?.names[0];
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

function SubjectDescription() {
    const description = aiConfig.description.store((state) => state.data);

    return (
        <>
        <div className='flex flex-col md:flex-row justify-between gap-8'>
            <div className="rounded-lg">
                {description?.title && <h2 className="text-2xl font-bold">{description?.title}</h2>}
                {description?.subtitle && <h3 className="text-lg font-bold">{description?.subtitle}</h3>}
                {description?.description && <p className="text-lg text-gray-800">{description?.description}</p>}
                
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Emerging Trends</h3>
                    <ul className="list-disc list-inside text-gray-800">
                        {description?.emergingTrends && description?.emergingTrends.map((trend, index) => (
                            <li key={index}>{trend}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="hidden md:flex rounded-lg border-white border-2 p-2 items-center justify-center">
                <p className="text-gray-800 italic font-sans text-center text-orange-800">{description?.funFact}</p>
            </div>
        </div>
        {/* Fun fact for mobile */}
        <div className="md:hidden mt-4">
            <p className="text-gray-800 italic font-sans text-center text-orange-800">{description?.funFact}</p>
        </div>
        </>
    )
}
