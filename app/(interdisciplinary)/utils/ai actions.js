'use server'

import { generateObject } from "ai"
import { aiConfig } from "./ai-config"
import { models } from "@/lib/ai"


const model = models.real;

export async function getAIObject(id, key, data) {
    const aiconfig = aiConfig[key]
    const prompt = aiconfig.prompt(data)
    const schema = aiconfig.schema
    const result = await generateObject({ model, schema, prompt })
    return result.object
}