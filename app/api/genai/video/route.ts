import { NextResponse } from 'next/server'
import { fal } from "@fal-ai/client"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Initialize Fal.ai client with API key
if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY
  })
}

export async function POST(req: Request) {
  try {
    const { 
      prompt, 
      image_url,
      aspect_ratio = 'auto',
      duration = '8s',
      generate_audio = true,
      resolution = '720p'
    }: { 
      prompt: string
      image_url: string
      aspect_ratio?: string
      duration?: string
      generate_audio?: boolean
      resolution?: string
    } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }

    if (!image_url || typeof image_url !== 'string') {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
    }

    console.log('Veo 3 Fast API Request:')
    console.log('- Prompt:', prompt)
    console.log('- Aspect Ratio:', aspect_ratio)
    console.log('- Duration:', duration)
    console.log('- Generate Audio:', generate_audio)
    console.log('- Resolution:', resolution)
    console.log('- Image URL type:', image_url.startsWith('data:') ? 'Data URI' : 'HTTP URL')

    // Submit request to Veo 3 Fast API
    const { request_id } = await fal.queue.submit("fal-ai/veo3/fast/image-to-video", {
      input: {
        prompt: prompt,
        image_url: image_url,
        aspect_ratio: aspect_ratio,
        duration: duration,
        generate_audio: generate_audio,
        resolution: resolution
      }
    })

    console.log('Veo 3 Fast request submitted:', request_id)

    return NextResponse.json({ 
      success: true,
      request_id: request_id,
      message: 'Request submitted to Veo 3 Fast. Use polling to get results.'
    })

  } catch (error: any) {
    console.error('Veo 3 Fast API Error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Failed to process Veo 3 Fast request' 
    }, { status: 500 })
  }
}

// GET route to check the status of a request
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const request_id = searchParams.get('request_id')

    if (!request_id) {
      return NextResponse.json({ error: 'Missing request_id' }, { status: 400 })
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
    }

    // Get the status of the request
    const status = await fal.queue.status("fal-ai/veo3/fast/image-to-video", {
      requestId: request_id,
      logs: true
    })
    
    console.log('Veo 3 Fast status check:', request_id, status.status)

    if (status.status === 'COMPLETED') {
      // Get the actual result
      const result = await fal.queue.result("fal-ai/veo3/fast/image-to-video", {
        requestId: request_id
      })
      
      return NextResponse.json({
        status: 'completed',
        video_url: result.data?.video?.url,
        data: result.data,
        request_id: result.requestId
      })
    } else if (status.status === 'FAILED') {
      return NextResponse.json({
        status: 'failed',
        error: 'Video generation failed'
      })
    } else {
      return NextResponse.json({
        status: 'processing',
        message: 'Request is still being processed'
      })
    }

  } catch (error: any) {
    console.error('Veo 3 Fast Status Check Error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Failed to check request status' 
    }, { status: 500 })
  }
}
