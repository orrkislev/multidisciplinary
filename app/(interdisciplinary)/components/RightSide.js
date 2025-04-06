'use client'

import Projects from "../sections/7 - Projects";
import useAIManager from "../utils/useAI";
import Terminology from "../sections/4 - Terminology";
import Questions from "../sections/5 - Questions";
import Timeline from "../sections/3 - Timeline";
import SubjectCard from "../sections/1 - SubjectCard";
import SubjectDescription from "../sections/2 - SubjectDescription";
import Background from "./Background";

export default function RightSide() {
    const ai = useAIManager();


    return (
        <div className="w-full h-full">
            <Background />
            <div className="parchment inverted-border-radius h-8 w-[50%] rounded-br-full z-[1000]" />
            <div className="flex flex-col gap-4 px-8 py-2 font-geist mr-4 mb-16 relative">
                {/* <div className="flex flex-col gap-4"> */}
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

            <style jsx>{`
                
                .inverted-border-radius {
                    position: absolute;
                    background-color: var(--parchment);
                    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }

                .inverted-border-radius::before {
                    content: "";
                    position: absolute;
                    background-color: transparent;
                    bottom: -100px;
                    height: 100px;
                    width: 50px;
                    border-top-left-radius: 50px;
                    box-shadow: 0 -50px 0 0 var(--parchment);
                }
            `}</style>
        </div>
    )
}
