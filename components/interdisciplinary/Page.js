'use client'

import Subjects from './Subjects'
import RightSide from './RightSide';

export default function InterdisciplinaryPage() {
    return (
        <div className="flex flex-col md:flex-row w-full h-auto md:h-screen bg-slate-200 transition-all duration-300">
            <div className={`overflow-y-auto h-[20vh] md:h-full md:flex-[1]`}>
                <Subjects />
            </div>
            <div className={`overflow-y-auto md:flex-[2]`}>
                <RightSide />
            </div>
        </div>
    );
}
