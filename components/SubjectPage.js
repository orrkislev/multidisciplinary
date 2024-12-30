'use client'

import SelectedSubjects from '@/components/SelectedSubjects';
import Subjects from '@/components/Subjects';
import { useState } from 'react';

export default function SubjectPage() {
    const [selected, setSelected] = useState([])
    return (
        <div className='bg-white flex w-full h-full'>
            <div className='flex-1'>
                <Subjects onUpdate={(newSelected) => setSelected(newSelected)} />
            </div>
            <div className='flex-[2]'>
                <SelectedSubjects subject1={selected[0]} subject2={selected[1]} />
            </div>
        </div>
    );
}
