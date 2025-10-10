import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_CREDITS: Record<string, number> = {
  starter: 30,
  professional: 100,
  enterprise: 999999,
}

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json()
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)
    const subscriptionId = session.subscription as string
    const customerId = session.customer as string
    const userId = session.metadata?.supabase_user_id

    if (!subscriptionId || !userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id || ''

    let plan: 'starter' | 'professional' | 'enterprise' = 'starter'
    if (priceId === (process.env.STRIPE_PROFESSIONAL_PRICE_ID as string)) plan = 'professional'
    if (priceId === (process.env.STRIPE_STARTER_PRICE_ID as string)) plan = 'starter'

    const credits = PLAN_CREDITS[plan]

    await supabase
      .from('user_profiles')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        plan,
        credits,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('id', userId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Finalize error:', error)
    return NextResponse.json({ error: error.message || 'Finalize failed' }, { status: 500 })
  }
}


