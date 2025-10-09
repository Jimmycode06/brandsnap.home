import { NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Configure Fal.ai client
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(req: Request) {
  try {
    const { 
      prompt, 
      aspect_ratio = '1:1',
      reference_images = []
    }: { 
      prompt: string
      aspect_ratio?: string
      reference_images?: string[]
    } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
    }

    console.log('Seedream API Request:')
    console.log('- Prompt:', prompt)
    console.log('- Aspect Ratio:', aspect_ratio)
    console.log('- Number of Reference Images:', reference_images.length)

    // Convert data URLs to URLs if needed (for Seedream, we need actual URLs)
    const image_urls: string[] = []
    
    for (const image of reference_images) {
      if (image.startsWith('http')) {
        // Already a public URL
        image_urls.push(image)
      } else if (image.startsWith('data:')) {
        // Seedream supports Base64 data URIs directly according to the documentation
        console.log('Using data URL directly with Seedream')
        image_urls.push(image)
      }
    }

    // Submit request to Seedream API
    const { request_id } = await fal.queue.submit("fal-ai/bytedance/seedream/v4/edit", {
      input: {
        prompt: prompt,
        image_urls: image_urls,
        image_size: aspect_ratio === '1:1' ? 'square' : 
                   aspect_ratio === '16:9' ? 'landscape_16_9' :
                   aspect_ratio === '9:16' ? 'portrait_16_9' : 'square',
        num_images: 1,
        max_images: 1,
        enable_safety_checker: true,
        sync_mode: false // Use async mode for better performance
      }
    })

    console.log('Seedream request submitted:', request_id)

    // For now, return the request_id. In a real implementation, you would:
    // 1. Store the request_id in a database
    // 2. Use webhooks or polling to get the result
    // 3. Return the result to the client

    return NextResponse.json({ 
      success: true,
      request_id: request_id,
      message: 'Request submitted to Seedream. Use webhooks or polling to get results.'
    })

  } catch (error: any) {
    console.error('Seedream API Error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Failed to process Seedream request' 
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
    const status = await fal.queue.status("fal-ai/bytedance/seedream/v4/edit", {
      requestId: request_id,
      logs: true
    })
    
    console.log('Seedream status check:', request_id, status.status)

    if (status.status === 'COMPLETED') {
      // Get the actual result
      const result = await fal.queue.result("fal-ai/bytedance/seedream/v4/edit", {
        requestId: request_id
      })
      
      return NextResponse.json({
        status: 'completed',
        image_url: result.data?.images?.[0]?.url,
        data: result.data,
        request_id: result.requestId
      })
    } else {
      return NextResponse.json({
        status: 'processing',
        message: 'Request is still being processed'
      })
    }

  } catch (error: any) {
    console.error('Seedream Status Check Error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Failed to check request status' 
    }, { status: 500 })
  }
}