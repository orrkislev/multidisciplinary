'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export default function TestPageWrapper() {
    return (
        <EndlessCanvasProvider>
            <TestPage />
        </EndlessCanvasProvider>
    )
}

function TestPage() {
    const [elements, setElements] = useState([])
    const { target, setTarget, pos } = useEndlessCanvas()

    useEffect(() => {
        setElements(Array.from({ length: 30 }, () => ({
            x: Math.random() * 2000 - 1000,
            y: Math.random() * 2000 - 1000,
        })))
    }, [])

    return (
        <div className="h-screen w-screen overflow-hidden relative">
            <div className='fixed top-2 left-2 p-2 bg-white rounded-md z-[100] text-xs flex flex-col gap-1' >
                <div>pos: {Math.round(-pos.x)} {Math.round(-pos.y)}</div>
                {target && <div>target: {Math.round(target.x)} {Math.round(target.y)}</div>}
            </div>
            <EndlessCanvas>
                {elements.map((element, index) => (
                    <div className='absolute w-[50px] h-[50px] bg-red-500 rounded-full'
                        key={index}
                        style={{
                            top: `${element.y}px`,
                            left: `${element.x}px`,
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            setTarget({ x: element.x, y: element.y })
                        }}
                    >
                        {Math.round(-element.x)} {Math.round(-element.y)}
                    </div>
                ))}
            </EndlessCanvas>
        </div>
    )
}



function EndlessCanvas({ children }) {
    const { pos, setPos, target, setTarget } = useEndlessCanvas()
    const [isDragging, setIsDragging] = useState(false)
    const [velocity, setVelocity] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) return
        const interval = setTimeout(() => {
            setVelocity(prev => ({ x: prev.x * 0.95, y: prev.y * 0.95 }))
            setPos(prev => ({ x: prev.x + velocity.x, y: prev.y + velocity.y }))
        }, 1000 / 60)
        return () => clearTimeout(interval)
    }, [isDragging, velocity])

    useEffect(() => {
        if (target) {
            const interval = setInterval(() => {
                setPos(prev => {
                    const dx = target.x - prev.x
                    const dy = target.y - prev.y
                    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
                        setTarget(null)
                        return {x: target.x, y: target.y}
                    }
                    return { x: prev.x + Math.ceil(dx / 10), y: prev.y + Math.ceil(dy / 10) }
                })
            }, 1000 / 60)
            return () => clearInterval(interval)
        }
    }, [target])

    return (
        <div className='absolute'
            style={{
                width: '20000px',
                height: '20000px',
                top: `${-pos.y - 10000}px`,
                left: `${-pos.x - 10000}px`,
                backgroundColor: 'beige',
                backgroundImage: `
                    linear-gradient(rgba(0,0,255, .05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,255, .05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0',
            }}
            onPointerDown={() => { setIsDragging(true); setVelocity({ x: 0, y: 0 }); setTarget(null); }}
            onPointerMove={(e) => {
                if (isDragging) setVelocity({ x: -e.movementX, y: -e.movementY })
            }}
            onPointerUp={() => setIsDragging(false)}
        >
            <div className='absolute' style={{
                width: '20000px',
                height: '20000px',
                top: `${10000 + window.innerHeight / 2}px`,
                left: `${10000 + window.innerWidth / 2}px`,
            }}>
                {children}
            </div>
        </div>
    )
}



const EndlessCanvasContext = createContext({
    target: null,
    setTarget: () => { },
    pos: { x: 0, y: 0 },
    setPos: () => { }
})
export function useEndlessCanvas() {
    return useContext(EndlessCanvasContext)
}
export function EndlessCanvasProvider({ children }) {
    const [target, setTarget] = useState(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })
    return <EndlessCanvasContext.Provider value={{ target, setTarget, pos, setPos }}>{children}</EndlessCanvasContext.Provider>
}