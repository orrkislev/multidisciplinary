'use client'

import SelectedSubjects from '@/components/SelectedSubjects';
import Subjects from '@/components/Subjects';
import { useUserData } from '@/utils/ai-config';

export default function SubjectPage() {
    const { subject1, subject2 } = useUserData();
    const isIncomplete = !subject1 || !subject2;

    return (
        <div className="flex flex-col md:flex-row w-full h-auto md:h-screen bg-slate-200 transition-all duration-300">
            <div className={`overflow-y-auto ${isIncomplete ? 'h-full' : 'h-[20vh]'} md:h-full ${isIncomplete ? 'md:flex-[3]' : 'md:flex-[1]'}`}>
                <Subjects />
            </div>
            <div className={`overflow-y-auto ${isIncomplete ? 'md:flex-[1]' : 'md:flex-[2]'}`}>
                <SelectedSubjects />
            </div>
        </div>
    );
}
