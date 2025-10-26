import { Clock, BookOpen, HelpCircle, Briefcase, Users2, TrendingUp, BadgeAlert, Amphora, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { dataActions } from '../utils/store';

export default function MergeMenu() {
    return (
        <div className='h-full flex flex-col'>
            <Link href="/">
                <div className='aspect-square border-b border-neutral-300 flex flex-col items-center justify-center group'>
                    <Amphora className="w-8 h-8 group-hover:rotate-45 transition-all mb-2" />
                    <span className='text-xl text-neutral-500'>Interdisciplinary</span>
                    <div className='flex items-center gap-2'>
                        <div className="flex flex-col">
                            <div className="text-xs text-center text-neutral-500 group-hover:text-neutral-900 transition-all delay-100">part of</div>
                            <div className="text-sm text-center text-neutral-500 group-hover:text-neutral-900 transition-all delay-100">the Serendipity Engine</div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="py-2 text-sm flex gap-2 items-center justify-center border-b border-neutral-300 group/new-merge cursor-pointer" onClick={() => dataActions.newMerge()}>
                <Plus className="w-4 h-4 text-neutral-500 group-hover/new-merge:text-neutral-700 transition-all duration-300 group-hover/new-merge:rotate-90" />
                <span className="text-neutral-500 group-hover/new-merge:text-neutral-700 transition-all duration-300">New Merge</span>
            </div>
            <div className="h-full flex flex-col gap-2 justify-center px-2">
                <SectionButton title="Description" Icon={Users2} _id="subject-description" />
                <SectionButton title="Emerging Trends" Icon={TrendingUp} _id="emerging-trends" />
                <SectionButton title="Fun Fact" Icon={BadgeAlert} _id="fun-fact" />
                <SectionButton title="Timeline" Icon={Clock} _id="timeline" />
                <SectionButton title="Terminology" Icon={BookOpen} _id="terminology" />
                <SectionButton title="Questions" Icon={HelpCircle} _id="questions" />
                <SectionButton title="Projects" Icon={Briefcase} _id="projects" />
            </div>
        </div>
    )
}

function SectionButton({ title, Icon, _id }) {
    const [inViewPercent, setInViewPercent] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = document.getElementById(_id);
        if (!section) return;
        sectionRef.current = section;

        // Build a threshold array: 0, 0.01, 0.02, ... 1.0
        const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const ratio = entry.intersectionRatio; // 0..1
                    setInViewPercent(Math.round(ratio * 100)); // 0..100 integer
                }
            },
            {
                root: null,          // viewport
                rootMargin: '0px',
                threshold: thresholds
            }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [_id]);

    return (
        <div className='text-sm p-1 px-2 cursor-pointer hover:bg-neutral-100 rounded-lg flex items-center gap-2 bg-neutral-50 transition-all duration-300'
            style={{
                background: lerpFade(inViewPercent).bgColor,
                color: lerpFade(inViewPercent).textColor,
            }}
            onClick={() => {
                if (sectionRef.current) {
                    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }}
        >
            <Icon className="w-4 h-4" />
            {title}
        </div>
    )
}







const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function lerpFade(inViewPercent) {
    const t = easeInOutCubic(clamp(inViewPercent / 100, 0, 1));
    const primary100 = { l: 0.96, c: 0.03, h: 275 };
    const primary800 = { l: 0.50, c: 0.10, h: 275 };
    const bgColor = oklchMix(primary100, primary800, t);
    const textDark = { l: 0.25, c: 0.08, h: 275 };
    const textLight = { l: 0.98, c: 0.02, h: 275 };
    const textColor = oklchMix(textDark, textLight, t);

    return { bgColor, textColor };
}

function oklchMix(oklchA, oklchB, t) {
    // oklchA/B: { l, c, h }; t in [0,1]
    // Linear interpolation. Hue is treated linearly; if you need proper hue shortest-arc, add wrap logic.
    const l = oklchA.l + (oklchB.l - oklchA.l) * t;
    const c = oklchA.c + (oklchB.c - oklchA.c) * t;
    const h = oklchA.h + (oklchB.h - oklchA.h) * t;
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
}

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}