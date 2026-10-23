"use client";
import { useState, useEffect } from 'react';

export default function CardImage({prompt}) {
    const [cardImage, setCardImage] = useState(null);

    useEffect(() => {
        if (cardImage || !prompt || prompt === '') return;
        (async () => {
            setCardImage('')
            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
            const res = await fetch('/api/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            })
            const data = await res.json();
            setCardImage(data.image);
        })();
    }, [prompt]);

    const style = {
        ...(cardImage && {
            backgroundImage: `url(data:image/jpeg;base64,${cardImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }),
        aspectRatio: '5/3',
    }

    return (
        <div style={style} className={`m-2 mb-0 rounded-[1.25rem] grayscale-[0.7] sepia-[0.15] group-hover/card:grayscale-0 group-hover/card:sepia-0 transition-all duration-500 ${cardImage ? '' : 'shimmer !rounded-[1.25rem]'}`} />
    );
}
