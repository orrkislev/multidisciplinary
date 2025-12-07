'use client';

import { startTransition, useState } from "react";
import { ViewTransition } from "react";

const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500'];
export default function TestPageWrapper() {
    const [selectedColor, setSelectedColor] = useState('bg-red-500');

    const selectColor = (color) => {
        startTransition(() => {
            setSelectedColor(color);
        })
    }

    return (
        <div className='grid grid-cols-3 grid-rows-2 gap-4 w-screen h-screen'>
            {colors.map((color) => (
                <ColorBox key={color} color={color} selected={selectedColor == color} setSelected={selectColor} />
            ))}

            <style jsx>{`
                ::view-transition-group(*) {
                    animation-duration: .5s;
                }
                ::view-transition-old(*) {
                    animation-name: slide-out;
                }
                ::view-transition-new(*) {
                    animation-name: slide-in;
                }
                @keyframes slide-out {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                @keyframes slide-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

function ColorBox({ color, selected, setSelected }) {
    return (
        <ViewTransition enter="slide-in">
            <button className={`color-box w-full h-full ${color} rounded-lg p-2 ${selected ? 'row-start-1 col-span-3' : ''}`} onClick={() => setSelected(color)}>

            </button>
        </ViewTransition>
    )
}