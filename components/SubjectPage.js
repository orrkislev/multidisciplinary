'use client'

import SelectedSubjects from '@/components/SelectedSubjects';
import Subjects from '@/components/Subjects';
import { useState } from 'react';

export default function SubjectPage() {
    const [selected, setSelected] = useState([])

    
    return (
        <div className='bg-white'>
            <Subjects onUpdate = {(newSelected) => setSelected(newSelected)} />
            <SelectedSubjects subject1={selected[0]} subject2={selected[1]} />
        </div>
    );
}
