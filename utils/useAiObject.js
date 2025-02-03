'use client'

import { experimental_useObject as useObject } from 'ai/react';
import { useEffect } from 'react';
import { aiConfig, useUserData } from './ai-config';

export function useAiObject({ cfg, key, onFinish }) {
    const userData = useUserData()
    const aiStore = cfg.store()
    const { object, submit } = useObject({
        api: '/api/name',
        schema: cfg.schema,
        onFinish
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
