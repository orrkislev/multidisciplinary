'use client'

import SelectedSubjects from '@/components/SelectedSubjects';
import Subjects from '@/components/Subjects';
import { useState } from 'react';

export default function SubjectPage() {
    return (
        <div className='bg-white flex w-full h-full'>
            <Subjects/>
            <div className='flex-[3]'>
                <SelectedSubjects />
            </div>
        </div>
    );
}
