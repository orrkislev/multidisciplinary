'use client'

import { create } from 'zustand';
import { useEffect, useRef, useState } from 'react';
import { aiConfig } from './ai-config';
import { useAiObject } from './useAiObject';

export const useSubjects = create((set) => ({
    subject1: null,
    subject2: null,
    setSubjects: (subject1, subject2) => set({ subject1, subject2 })
}));

export const AIData = create((set) => ({
    names: [],
    projects: [],
    questions: [],
    setNames: (names) => set({ names }),
    setProjects: (projects) => set({ projects }),
    setQuestions: (questions) => set({ questions }),
}));

export default function useAIManager() {
    const { subject1, subject2 } = useSubjects()

    const [curr, setCurr]= useState(null)
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
    }, [curr, subject1, subject2])
}
