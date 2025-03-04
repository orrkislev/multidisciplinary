import AIImage from '@/components/AIImage';
import { aiConfig, useUserData } from '@/utils/ai-config';
import { styled } from '@/utils/tw';
import { useEffect, useState } from 'react';

const SubjectTop = styled.div`font-cylburn font-bold text-3xl leading-[1em] text-left z-10`;
const SubjectBottom = styled.div`font-cylburn font-bold text-3xl leading-[1em] text-right z-10`;
const MainName = styled.div`font-magilio tracking-wide font-bold text-6xl leading-[1em] text-center z-10`

export default function SubjectCard() {
    const { subject1, subject2 } = useUserData();
    const names = aiConfig.names.store(state => state.data);
    const [name, setName] = useState(null);
    const [imgPrompt, setImgPrompt] = useState(null);

    useEffect(()=>{
        if (!subject1 || !subject2) return;
        setImgPrompt(`${subject1} and ${subject2}. pastel colors, soft, dreamy. no text, no logos, no watermarks. `)
    },[subject1, subject2])

    useEffect(() => {
        if (!names || !names.names) return;
        if (!Array.isArray(names.names)) return;
        setName(names.names[0]);
    }, [names])

    const content = {
        subject1: 'Pick a subject',
        subject2: 'Pick another subject',
        name: 'Interdisciplinary'
    }

    if (subject1) content.subject1 = subject1;
    if (subject2) content.subject2 = subject2;
    if (subject1 && subject2) content.name = ''
    if (name) content.name = name;

    return (
        <div className="text-center p-4 rounded-lg relative text-white bg-gray-400 flex flex-col justify-between relative p-4 gap-8">
            {/* <div className='absolute z-0 inset-0 rounded-lg' style={bgStyle} /> */}
            <AIImage prompt={imgPrompt} className='absolute z-0 inset-0 rounded-lg' />
            <SubjectTop>{content.subject1}</SubjectTop>
            <MainName>{content.name}</MainName>
            <SubjectBottom>{content.subject2}</SubjectBottom>
        </div >
    )
}