'use client'

import { useEffect, useState } from 'react';
import { aiConfig, useUserData } from './ai-config';
import { useAiObject } from './useAiObject';


export default function useAIManager() {
    const { subject1, subject2, proficiency } = useUserData()

    const [curr, setCurr] = useState(null)
    const aiObjects = {}
    for (const key of Object.keys(aiConfig).sort()) {
        aiObjects[key] = useAiObject({ cfg: aiConfig[key], key, onFinish: () => setCurr(null) })
    }

    useEffect(() => {
        if (!subject1 || !subject2) {
            Object.values(aiObjects).forEach(obj => obj.reset())
            return
        }

        if (curr) curr.run()
        else {
            const nextObject = Object.values(aiObjects).find(obj => {
                if (obj.object) return false
                if (!obj.checkDependencies()) return false
                return true
            })
            setCurr(nextObject)
        }
    }, [curr, subject1, subject2, proficiency])
}
