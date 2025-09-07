import { GoogleGenAI } from '@google/genai'

export function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY')
  }
  return new GoogleGenAI({ apiKey })
}

export function getModel(modelName?: string) {
  const ai = getGenAI()
  const model = modelName || process.env.GEMINI_MODEL || 'gemini-2.5-flash-image-preview'
  // In new SDK, models are accessed via ai.models
  return { ai, model }
}


