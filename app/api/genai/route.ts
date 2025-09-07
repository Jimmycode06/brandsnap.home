import { NextResponse } from 'next/server'
import { getModel } from '@/lib/genai'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }
    const { ai, model } = getModel()
    const result = await ai.models.generateContent({ model, contents: prompt })
    const candidates: any[] = (result as any)?.candidates || []
    const text = candidates[0]?.content?.parts?.find((p: any) => p?.text)?.text || ''
    return NextResponse.json({ text })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'GenAI error' }, { status: 500 })
  }
}


