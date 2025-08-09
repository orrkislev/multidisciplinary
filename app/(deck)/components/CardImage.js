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
        backgroundImage: `url(data:image/jpeg;base64,${cardImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'black',
        aspectRatio: '5/3',
    }

    return (
        <div style={style} className='grayscale group-hover:grayscale-0 transition-all duration-300' />
    );
}
