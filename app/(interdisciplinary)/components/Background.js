import { useEffect } from "react";
import { useUserData } from "../utils/ai-config";
import { useAIImage } from "./AIImage";

export default function Background(props) {
    const { subject1, subject2 } = useUserData();
    // const img = {backgroundImage : 'url(/pattern.jpg)'}
    const img = useAIImage()

    useEffect(()=>{
        if (!subject1 || !subject2) return;
        const prompt = `Seamless pattern of ${subject1} and ${subject2}, abstract, watercolor style, blue background.`
        img.get({prompt})
    },[subject1, subject2])

    return (

        <div className="wrapper h-full overflow-hidden z-[0] absolute top-0 left-0 right-0 bottom-0"
            style={{
                backgroundImage: img.img ? img.backgroundImage : 'url(/pattern.jpg)',
                backgroundSize: '600px',
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center',
                backgroundBlendMode: 'screen',
                filter: 'saturate(0.5) brightness(0.5)',
                opacity: 0.5,
            }}
        />
    )
}