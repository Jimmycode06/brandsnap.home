import { NextResponse } from 'next/server'
import { fal } from "@fal-ai/client"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY
  })
}

export async function POST(req: Request) {
  try {
    const {
      prompt,
      image_urls = [],
      num_images = 1,
    }: {
      prompt: string
      image_urls?: string[]
      num_images?: number
    } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    console.log('Fal.ai nano-banana/edit API Request:')
    console.log('- Prompt:', prompt)
    console.log('- Image URLs:', image_urls.length)
    console.log('- Num Images:', num_images)

    // Use Data URIs directly as per documentation
    console.log(`Using ${image_urls.length} images directly as Data URIs`)
    
    const inputData = {
      prompt,
      image_urls,
      num_images,
      output_format: "jpeg"
    }
    console.log('Sending to nano-banana/edit:', JSON.stringify(inputData, null, 2))

    // Synchronous request with nano-banana/edit model
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: inputData,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log)
        }
      },
    })

    if (result.data?.images && result.data.images.length > 0) {
      return NextResponse.json({ 
        success: true, 
        image_url: result.data.images[0].url,
        description: result.data.description || ''
      })
    } else {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Fal.ai Gemini API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to generate image with Fal.ai Gemini' 
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const request_id = searchParams.get('request_id')

    if (!request_id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    const status = await fal.queue.status("fal-ai/nano-banana/edit", {
      requestId: request_id,
      logs: true
    })

    if (status.status === 'COMPLETED' && status.output && status.output.images) {
      return NextResponse.json({ 
        status: 'COMPLETED', 
        image_url: status.output.images[0].url,
        description: status.output.description || ''
      })
    }

    // Return the typed status directly (IN_PROGRESS | IN_QUEUE)
    return NextResponse.json({ status: status.status, logs: status.logs })
  } catch (error: any) {
    console.error('Fal.ai Gemini Polling Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get Fal.ai Gemini status' 
    }, { status: 500 })
  }
}
