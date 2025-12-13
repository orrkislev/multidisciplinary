'use server'

import { generateObject } from "ai"
import { aiConfig } from "./ai-config"
import { google } from "@ai-sdk/google"


const model = google("gemini-2.5-flash")

export async function getAIObject(id, key, data) {
    const aiconfig = aiConfig[key]
    const prompt = aiconfig.prompt(data)
    const schema = aiconfig.schema
    const result = await generateObject({ model, schema, prompt })
    return result.object
}