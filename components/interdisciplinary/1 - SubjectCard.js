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
    const [img, setImg] = useState(null);

    useEffect(() => {
        if (!names || !names.names) return;
        if (!Array.isArray(names.names)) return;
        setName(names.names[0]);
    }, [names])

    useEffect(() => {
        if (!name) return
        fetch('/api/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject1, subject2, newName: name })
        })
            .then(res => res.json())
            .then(data => {
                setImg(data.image)
            })
    }, [name])


    const bgStyle = {
        backgroundImage: `url(data:image/jpeg;base64,${img})`,
        filter: 'saturate(0.5) brightness(0.5)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }

    const content = {
        subject1: subject1 || 'Pick a subject',
        subject2: subject2 || 'Pick another subject',
        name: name || 'Interdisciplinary'
    }

    return (
        <div className="text-center p-4 rounded-lg relative text-white bg-gray-400 flex flex-col justify-between relative p-4 gap-8">
            <div className='absolute z-0 inset-0 rounded-lg' style={bgStyle} />
            <SubjectTop>{content.subject1}</SubjectTop>
            <MainName>{content.name}</MainName>
            <SubjectBottom>{content.subject2}</SubjectBottom>
        </div >
    )
}