'use client'

import SelectedSubjects from '@/components/SelectedSubjects';
import Subjects from '@/components/Subjects';
import { useState } from 'react';

export default function SubjectPage() {
    return (
        <div className='bg-white flex w-full h-full justify-center items-center bg-slate-200 transition-all duration-300'>
            <Subjects/>
            <SelectedSubjects />
        </div>
    );
}
