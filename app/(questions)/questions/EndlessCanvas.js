'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';



export default function EndlessCanvas({ children }) {
    const { pos, setPos, target, setTarget } = useEndlessCanvas()
    const [isDragging, setIsDragging] = useState(false)
    const [velocity, setVelocity] = useState({ x: 0, y: 0 })
    const childrenContainerRef = useRef(null)

    useEffect(() => {
        if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) return
        const interval = setTimeout(() => {

            setVelocity(prev => {
                const container = childrenContainerRef.current
                if (!container) return prev

                const children = Array.from(container.children)
                if (children.length === 0) return prev

                const windowRect = {
                    left: 0,
                    top: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                }

                let anyVisible = false
                let closest = { dist: Infinity, dx: 0, dy: 0 }

                for (const el of children) {
                    const rect = el.getBoundingClientRect()

                    // Check if it's visible (intersects viewport)
                    const visible =
                        rect.right > windowRect.left &&
                        rect.left < windowRect.right &&
                        rect.bottom > windowRect.top &&
                        rect.top < windowRect.bottom

                    if (visible) {
                        anyVisible = true
                        break
                    }

                    // Compute how far it is from viewport center
                    const cx = (rect.left + rect.right) / 2
                    const cy = (rect.top + rect.bottom) / 2
                    const dx = cx - window.innerWidth / 2
                    const dy = cy - window.innerHeight / 2
                    const dist = Math.hypot(dx, dy)
                    if (dist < closest.dist) {
                        closest = { dist, dx, dy }
                    }
                }

                const hit = { x: 0, y: 0 }
                if (!anyVisible && closest.dist < Infinity) {
                    hit.x = Math.sign(closest.dx) * 1
                    hit.y = Math.sign(closest.dy) * 1
                }

                return ({
                    x: prev.x * 0.95 + hit.x,
                    y: prev.y * 0.95 + hit.y
                })
            })
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
                        return { x: target.x, y: target.y }
                    }
                    return { x: prev.x + Math.ceil(dx / 10), y: prev.y + Math.ceil(dy / 10) }
                })
            }, 1000 / 60)
            return () => clearInterval(interval)
        }
    }, [target])


    return (
        <div className='absolute w-full h-full bg-gradient-to-b from-[#f3f3f3] to-[#f7fcf7]'>
            <div className='absolute'
                style={{
                    width: '20000px',
                    height: '20000px',
                    top: `${-pos.y - 10000}px`,
                    left: `${-pos.x - 10000}px`,
                    backgroundImage: `radial-gradient( #00000055 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0',
                }}
                onPointerDown={() => { setIsDragging(true); setVelocity({ x: 0, y: 0 }); setTarget(null); }}
                onPointerMove={(e) => {
                    if (isDragging) setVelocity({ x: -e.movementX, y: -e.movementY })
                }}
                onPointerUp={() => setIsDragging(false)}
            >
                <div className='absolute' ref={childrenContainerRef} style={{
                    top: `${10000 + window.innerHeight / 2}px`,
                    left: `${10000 + window.innerWidth / 2}px`,
                }}>
                    {children}
                </div>
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