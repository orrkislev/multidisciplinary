'use client'

import { useState } from "react";
import Description from "./Description";
import useIdeatorAI from "./useIdeatorAI";
import Strategies from "./Strategies";
import Question from "./Question";
import { isHebrew } from "@/utils/utils";

export default function Ideator() {
    const [txt, setTxt] = useState('');
    const [commitedContent, setCommitedContent] = useState('');
    const { getAI } = useIdeatorAI();

    return (
        <div className="fixed inset-0 flex">
            <div className="flex flex-col w-1/3 h-full bg-white p-4 overflow-auto justify-between">
                <Description newContent={commitedContent} onUpdate={newDescription => getAI(newDescription)} />
                <Strategies />
            </div>

            <div className="flex flex-col items-center justify-center w-2/3 bg-gradient-to-br from-blue-500 to-blue-300 p-4 gap-16">
                <div className="font-serif text-3xl font-bold text-white">TELL ME ABOUT YOUR PROJECT</div>
                <input type="text"  value={txt} 
                    className={`w-full p-2 rounded-md ${isHebrew(txt) ? 'rtl' : ''}`}
                    placeholder="Tell me facts about your project"
                    onChange={(e) => setTxt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setCommitedContent(txt);
                            setTxt('');
                        }
                    }}
                />
                <Question />
            </div>
        </div>
    )
}