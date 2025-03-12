import { useCallback, useEffect, useRef, useState } from "react";
import { isHebrew } from "@/utils/utils";
export default function Description({ newContent, onUpdate }) {
    const [txt, setTxt] = useState('');
    const timer = useRef(null);

    const handleAI = useCallback((newContent) => {

        const prompt = `You are a direct response AI. Provide only the project description, no questions or additional text.
        Current description: ${txt}
        ${newContent ? `New content to integrate: ${newContent}` : 'Rephrase the current description to be more concise'}
        
        Rules:
        - Use the same language as the input (hebrew or english)
        - Only output the final description
        - No questions or additional text
        - Maintain key information while being concise`

        fetch('/api/general', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        }).then(response => {
            const reader = response.body.getReader();
            let result = '';

            function readStream() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        setTxt(result);
                        onUpdate(result);
                        return;
                    }

                    result += new TextDecoder().decode(value);
                    return readStream();
                });
            }

            return readStream();
        });
    }, [txt]);

    useEffect(() => {
        if (newContent) handleAI(newContent);
    }, [newContent])

    const updateInput = (e) => {
        setTxt(e.target.value);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(handleAI, 5000);
    }

    const hasHebrewContent = isHebrew(txt);

    return (
        <div className={hasHebrewContent ? 'rtl' : ''}>
            {txt.length > 0 && (
                <>
                    <h3 className="text-sm font-bold">{hasHebrewContent ? 'תיאור הפרויקט' : 'Project Description'}</h3>
                    <textarea className='w-full h-full' value={txt} onChange={updateInput} rows={10} />
                </>
            )}
        </div>
    )
}