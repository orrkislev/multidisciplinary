'use client'

import Subjects from './Subjects'
import { useUserData } from '@/utils/ai-config';
import RightSide from './RightSide';

export default function InterdisciplinaryPage() {
    const { subject1, subject2 } = useUserData();
    const isIncomplete = !subject1 || !subject2;

    return (
        <div className="flex flex-col md:flex-row w-full h-auto md:h-screen bg-slate-200 transition-all duration-300">
            <div className={`overflow-y-auto ${isIncomplete ? 'h-full' : 'h-[20vh]'} md:h-full ${isIncomplete ? 'md:flex-[3]' : 'md:flex-[1]'}`}>
                <Subjects />
            </div>
            {!isIncomplete && (
                <div className={`overflow-y-auto md:flex-[2]`}>
                    <RightSide />
                </div>
            )}
        </div>
    );
}
