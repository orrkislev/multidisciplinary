import { useEffect, useState } from "react";

export function useAIImage(prompt) {
    const [img, setImg] = useState(null);

    const get = (data) => {
        fetch('/api/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                setImg(data.image)
            })
    }

    const reset = () => {
        setImg(null);
    }

    return {
        backgroundImage: `url(data:image/jpeg;base64,${img})`,
        img,
        get,
        reset,
    }
}