'use client'

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef, useState } from "react";

gsap.registerPlugin(TextPlugin, SplitText);

const texts = [
    "grab a piece of paper",
    "write down a word",
    "circle the word",
    "fold the paper",
    "put the paper in your pocket",
    "take the paper out of your pocket",
    "read the word",
    "think about the word",
    "write down the word",
]

export default function ActionPage() {
    const [step, setStep] = useState(null);
    const [result, setResult] = useState(1);

    const changeText = () => {
        setResult(null);
        setStep(prev => ({ ...prev, text: null }));
        const newText = texts[Math.floor(Math.random() * texts.length)];
        setStep({ text: newText, time: Math.floor(Math.random() * 10) + 1 });
    }


    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-red-500 p-8">

            {result && (
                <div className="text-white text-4xl font-bold" onClick={changeText}>
                    {result === "timeout" ? "TRY AGAIN?" : "NEXT ONE!"}
                </div>
            )}

            <ActionTitle text={step?.text} />
            <Timer time={step?.time} onComplete={(result) => setResult(result)} />
        </div>
    )
}

function ActionTitle({ text }) {
    useGSAP(() => {
        const split = SplitText.create("#text", { type: "words" });
        gsap.from(split.words, {
            y: 20,
            opacity: 0,
            scale: .9,
            rotation: "random(-20, 20)",
            duration: .3,
            ease: "back",
            stagger: 0.05
        })
    }, [text]);

    return <h1 id="text" className="text-4xl font-bold text-white text-center" >{text}</h1>
}

function Timer({ time, onComplete = (result) => { } }) {
    const [timer, setTimer] = useState(time);
    const [showLabel, setShowLabel] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useGSAP(() => {
        if (!time) return;

        const tl = gsap.timeline();
        const timerObject = { seconds: timer };

        tl.to(timerObject, {
            seconds: time,
            onUpdate: () => setTimer(timerObject.seconds),
            duration: 1,
            ease: "power2.inOut"
        })
        tl.to('#timer', {
            width: window.innerWidth * .8,
            duration: 1,
            ease: "power2.inOut"
        }, '<')

        tl.to(timerObject, {
            seconds: 0,
            onStart: () => setShowLabel(true),
            onUpdate: () => setTimer(timerObject.seconds),
            duration: time,
            ease: "linear"
        }, '+=0.5')

        tl.to('#timer', {
            width: 0,
            duration: time,
            ease: "linear",
        }, '<').then(() => {
            setShowLabel(false);
            onComplete("timeout");
        })

        const mouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        const stopTimer = () => {
            tl.kill();
            setShowLabel(false);
            onComplete("stop");
        }
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('keydown', stopTimer);
        window.addEventListener('mousedown', stopTimer);
        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('keydown', stopTimer);
            window.removeEventListener('mousedown', stopTimer);
            setShowLabel(false);
            tl && tl.kill();
        }
    }, [time]);

    return (
        <>
            <div className="relative">
                <div className="text-center h-16 text-white text-4xl font-bold flex items-center justify-center">TIMEOUT</div>
                <div id="timer" className="absolute top-0 left-1/2 -translate-x-1/2 h-16 bg-white overflow-hidden w-full flex items-center justify-center text-4xl font-bold text-red-500">
                    {timer && typeof timer === 'number' && timer.toFixed(2).replace('.', ':')}
                </div>
            </div>
            {showLabel && (
                <div className="fixed p-2 bg-white text-red-500" style={{ left: mousePos.x + 10, top: mousePos.y + 10 }}>
                    CLICK ANYWHERE TO STOP THE TIMER
                </div>
            )}
        </>
    )
}