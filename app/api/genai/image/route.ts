import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

type InlineImage = { dataUrl?: string; base64?: string; mimeType?: string }

function dataUrlToParts(images?: InlineImage[]) {
  if (!images || images.length === 0) return [] as any[]
  return images.map((img) => {
    let mime = img.mimeType || 'image/png'
    let data = img.base64 || ''
    if (!data && img.dataUrl) {
      const match = img.dataUrl.match(/^data:(.*?);base64,(.+)$/)
      if (match) {
        mime = match[1] || mime
        data = match[2]
      }
    }
    return {
      inlineData: {
        mimeType: mime,
        data,
      },
    }
  })
}

export async function POST(req: Request) {
  try {
    const { prompt, images }: { prompt: string; images?: InlineImage[] } = await req.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image-preview'

    const contents: any[] = [{ text: prompt }]
    contents.push(...dataUrlToParts(images))

    const response = await ai.models.generateContent({ model, contents })

    // Find first inlineData image part
    const candidates = response?.candidates || []
    for (const c of candidates) {
      const parts = c?.content?.parts || []
      for (const part of parts) {
        if (part?.inlineData?.data) {
          const mime = part?.inlineData?.mimeType || 'image/png'
          const base64 = part.inlineData.data as string
          return NextResponse.json({ image: `data:${mime};base64,${base64}` })
        }
      }
    }

    // If no image returned, try returning any text part for debugging
    for (const c of candidates) {
      const parts = c?.content?.parts || []
      for (const part of parts) {
        if (part?.text) {
          return NextResponse.json({ text: part.text }, { status: 200 })
        }
      }
    }

    return NextResponse.json({ error: 'No image generated' }, { status: 502 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'GenAI error' }, { status: 500 })
  }
}


