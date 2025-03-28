import { useEffect, useState } from "react";

export default function AIImage(props) {
    const [img, setImg] = useState(null);

    useEffect(() => {
        if (!prompt) return
        fetch('/api/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: props.prompt })
        })
            .then(res => res.json())
            .then(data => {
                setImg(data.image)
            })
    }, [props.prompt])


    const bgStyle = {
        backgroundImage: `url(data:image/jpeg;base64,${img})`,
        filter: 'saturate(0.5) brightness(0.5)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }
    // merge with prompt.style if it exists
    if (props.style) Object.assign(bgStyle, props.style)

    return (
        <div style={bgStyle} {...props} >
            {props.children}
        </div>
    )
}