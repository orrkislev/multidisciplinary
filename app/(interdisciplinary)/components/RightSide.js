'use client'

import Projects from "../sections/7 - Projects";
import useAIManager from "../utils/useAI";
import Terminology from "../sections/4 - Terminology";
import Questions from "../sections/5 - Questions";
import Timeline from "../sections/3 - Timeline";
import SubjectCard from "../sections/1 - SubjectCard";
import SubjectDescription from "../sections/2 - SubjectDescription";


export default function RightSide() {
    const ai = useAIManager();
    
    return (
        <div className="flex flex-col gap-4 px-4 py-2 font-geist mr-4 mb-16 mt-4">
            <div className="flex flex-col gap-4">
                <SubjectCard />
                <div className="bg-gray-100 p-4 backdrop-blur-lg rounded-lg">
                    <SubjectDescription />
                </div>
            </div>
            <Timeline />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Terminology />
                <Questions />
            </div>
            <Projects />
            {/* <Quiz /> */}
        </div>
    )
}
