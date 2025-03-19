'use client'

import Projects from "./7 - Projects";
import useAIManager from "@/utils/useAI";
import { aiConfig, useUserData } from "@/utils/ai-config";
import Terminology from "./4 - Terminology";
import Questions from "./5 - Questions";
import Quiz from "./6 - Quiz";
import Timeline from "./3 - Timeline";
import SubjectCard from "./1 - SubjectCard";
import SubjectDescription from "./2 - SubjectDescription";


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
