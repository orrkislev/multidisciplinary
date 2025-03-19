'use client'

import { experimental_useObject as useObject } from 'ai/react';
import { useEffect } from 'react';
import { aiConfig, useUserData } from './ai-config';
import { create } from 'zustand';

const useTokenCounter = create(set => ({
    input: 0,
    addInput: (text) => set(state => ({ input: state.input + text.split(' ').length })),
    output: 0,
    addOutput: (obj) => set(state => ({ output: state.output + JSON.stringify(obj).split(' ').length }))
}))

export function useAiObject({ cfg, key, onFinish }) {
    const tokenCounter = useTokenCounter()
    const userData = useUserData()
    const aiStore = cfg.store()
    const { object, submit } = useObject({
        api: '/api/name',
        schema: cfg.schema,
        onFinish
        // onFinish: (object, error) => {
        //     tokenCounter.addOutput(object)
        //     onFinish({ object, error })
        // }
    })

    useEffect(() => {
        if (object) aiStore.setData(object)
    }, [object])

    const reset = () => {
        aiStore.setData(null)
    }

    const run = () => {
        const context = Object.keys(aiConfig).reduce((acc, key) => {
            acc[key] = aiConfig[key].store.getState().data;
            return acc;
        }, {})
        Object.assign(context, userData)
        const names = aiConfig.names.store.getState().data
        if (names) context.name = names[0]
        const prompt = cfg.prompt(context)
        tokenCounter.addInput(prompt)
        submit({ prompt, key })
    }

    const checkDependencies = () => {
        if (cfg.dependencies) {
            for (const dep of cfg.dependencies) {
                if (userData[dep]) continue
                if (!aiConfig[dep]) return false
                if (!aiConfig[dep].store.getState().data) return false
            }
        }
        return true
    }

    return { object: aiStore.data, run, reset, cfg, checkDependencies }
}
