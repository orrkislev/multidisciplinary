import { aiConfig, useUserData } from '../utils/ai-config';
import { styled } from '@/utils/tw';
import { use, useEffect, useRef, useState } from 'react';
import { useAIImage } from '../components/AIImage';
import { AnimatePresence, motion } from 'framer-motion';

export default function SubjectCard() {
    const { subject1, subject2 } = useUserData();
    const names = aiConfig.names.store(state => state.data);
    const [name, setName] = useState(null);
    const img = useAIImage()
    const ref = useRef(null);
    const [useSmallTitle, setUseSmallTitle] = useState(false);

    useEffect(() => {
        // add a listener for when the ref is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setUseSmallTitle(false);
                else setUseSmallTitle(true);
            })
        }, { threshold: 0.5 })
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        }
    }, [])

    useEffect(() => {
        if (!subject1 || !subject2) return img.reset()
        // img.get(`${subject1} and ${subject2}. pastel colors, soft, dreamy. no text, no logos, no watermarks. `)
        const prompt = `watercolor illustration of ${subject1} and ${subject2}. vibrant. beige, dark blues and pinks.`
        const negative_prompt = 'text, logos, watermarks, border, clutter, busy background'
        // const prompt = `A flat-style 2D digital illustration of ${subject1} and ${subject2}, clean composition, soft lighting, minimalistic background, vector-style shapes, cozy aesthetic, editorial layout, modern UI design, white or beige background, no texture, no clutter, studio lighting`
        // const negative_prompt = "busy background, gradients, photographic textures, harsh shadows, cluttered layout, noisy details, text, UI elements, logos, image borders"
        img.get({ prompt, width: 1024, height: 512, negative_prompt })
    }, [subject1, subject2])

    useEffect(() => {
        if (!names || !names.names) return setName(null)
        if (!Array.isArray(names.names)) return setName(null);
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
        <>
            <div className="text-parchment px-4 pt-4 mb-8" ref={ref}>
                <div className="w-full flex relative min-h-[30vh] ">
                    <div className='absolute top-0 right-0 w-[70%] bg-cover rounded-xl'
                        style={{
                            backgroundImage: `url(data:image/jpeg;base64,${img.img})`,
                            filter: 'saturation(0) blur(20px) contrast(100) brightness(1.5)',
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                            aspectRatio: '2/1',
                        }}
                    />
                    <div className='z-[200] pl-8 pt-32 mb-4' >
                        <div className="">
                            <div className='flex gap-2 items-center font-bold tracking-wide'>
                                <span className='parchment p-2 rounded'>{content.subject1}</span>
                                X
                                <span className='parchment p-2 rounded'>{content.subject2}</span>
                            </div>
                        </div>
                        <div className='pt-4 font-magilio tracking-wide text-[7em] leading-[.9em] font-bold'
                            style={{
                                textShadow: '2px 2px 4px rgba(97, 75, 75, 0.5)',
                                overflowWrap: 'break-word',
                            }}
                        >
                            {content.name}
                        </div>
                    </div>
                </div>
            </div >
            <AnimatePresence>
            {useSmallTitle &&
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-[.2em] w-[50%] text-xl z-[1000] flex items-center gap-2">
                    <div className='text-sm'>{subject1} x {subject2}</div>
                    <div className='font-magilio font-bold'>{content.name}</div>
                </motion.div>
            }
            </AnimatePresence>
        </>
    )
}