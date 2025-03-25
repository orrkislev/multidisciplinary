"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function CardImage(props) {
    const [cardImage, setCardImage] = useState(null);

    useEffect(() => {
        if (cardImage || !props.prompt || props.prompt === '') return;
        (async () => {
            setCardImage('')
            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
            const res = await fetch('/api/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: props.prompt }),
            })
            const data = await res.json();
            setCardImage(data.image);
        })();
    }, [props.prompt]);

    const style = {
        backgroundImage: `url(data:image/jpeg;base64,${cardImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'black',
        width: '100%',
        height: props.selected ? '50%' : '70%',
    }

    return (
        <div style={style} />
    );
}
