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
        <div className="flex-1 h-screen relative bg-gray-100 pb-16">
            <div className="h-full overflow-y-auto flex flex-col gap-4 px-8 py-2 font-geist z-1 pb-16">
                <SubjectCard />
                <SubjectDescription />
                <Timeline />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Terminology />
                    <Questions />
                </div>
                <Projects />
                {/* <Quiz /> */}
            </div>
            <div className='absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-gray-200 to-transparent z-2' />

        </div>
    )
}
