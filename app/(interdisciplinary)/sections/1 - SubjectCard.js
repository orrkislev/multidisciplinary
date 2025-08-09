import { aiConfig, useUserData } from '../utils/ai-config';
import { useEffect, useRef, useState } from 'react';
import { useAIImage } from '../components/AIImage';
import { AnimatePresence, motion } from 'framer-motion';

export default function SubjectCard() {
    const { subject1, subject2 } = useUserData();
    const names = aiConfig.names.store(state => state.data);
    const [name, setName] = useState(null);
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
            <div className="px-4 pt-4 mb-8" ref={ref}>
                <div className="w-full flex relative ">
                    <div className='pl-8 pt-32 mb-4' >
                        <div className="">
                            <div className='flex gap-2 items-center font-bold tracking-wide'>
                                <span className='p-2 rounded'>{content.subject1}</span>
                                X
                                <span className='p-2 rounded'>{content.subject2}</span>
                            </div>
                        </div>
                        <div className='pt-4 font-magilio tracking-wide text-[7em] leading-[.9em] font-bold'
                            style={{
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