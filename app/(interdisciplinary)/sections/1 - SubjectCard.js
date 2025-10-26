import { X } from 'lucide-react';
import { useData } from '../utils/store';

export default function SubjectCard() {
    const currentMerge = useData(state => state.getActiveMerge());

    const subject1 = currentMerge?.subjects?.[0];
    const subject2 = currentMerge?.subjects?.[1];

    let Title = 'Interdisciplinary';
    if (subject1 && subject2) {
        if (currentMerge?.name) {
            Title = currentMerge?.name;
        } else {
            Title = <span className='animate-pulse bg-gray-400 rounded-lg w-full text-center text-transparent'>Loading...</span>;
        }
    }

    return (
        <div id="subject-card" className="pt-4 mt-16 mb-8 w-full flex flex-col gap-2">
            <div className='pl-8 flex gap-2 items-center tracking-wide font-markazi'>
                <span className={!subject1 && 'animate-bounce font-bold'}>{subject1 || '<-- Pick a subject'}</span>
                <X className='w-4 h-4' />
                <span className={subject1 && !subject2 && 'animate-bounce font-bold'}>{subject2 || 'Pick another subject'}</span>
            </div>
            <div className='font-magilio tracking-wide text-[7em] leading-[.9em] font-bold'
                style={{
                    overflowWrap: 'break-word',
                }}
            >
                {Title}
            </div>
        </div>
    )
}