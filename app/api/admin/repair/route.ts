import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_TOKEN = process.env.ADMIN_REPAIR_TOKEN

const PLAN_CREDITS: Record<string, number> = {
  starter: 30,
  professional: 100,
  enterprise: 999999,
}

function mapPriceToPlan(priceId?: string | null): 'starter' | 'professional' | 'enterprise' {
  if (!priceId) return 'starter'
  if (process.env.STRIPE_PROFESSIONAL_PRICE_ID && priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) return 'professional'
  if (process.env.STRIPE_STARTER_PRICE_ID && priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  return 'starter'
}

export async function POST(req: NextRequest) {
  try {
    if (!ADMIN_TOKEN) return NextResponse.json({ error: 'Missing admin token env' }, { status: 500 })

    const auth = req.headers.get('authorization') || ''
    if (auth !== `Bearer ${ADMIN_TOKEN}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { userId, email } = await req.json()
    if (!userId && !email) return NextResponse.json({ error: 'Provide userId or email' }, { status: 400 })

    // 1) Fetch profile
    const { data: profile, error: profErr } = await supabase
      .from('user_profiles')
      .select('id, email, stripe_customer_id')
      .eq(userId ? 'id' : 'email', userId ?? email)
      .single()
    if (profErr || !profile) return NextResponse.json({ error: 'Profile not found', details: profErr }, { status: 404 })

    // 2) Find subscription for customer
    let customerId = profile.stripe_customer_id as string | null
    if (!customerId) {
      // attempt to find by email in Stripe
      const customers = await stripe.customers.list({ email: profile.email || undefined, limit: 1 })
      customerId = customers.data[0]?.id || null
      if (customerId) {
        await supabase.from('user_profiles').update({ stripe_customer_id: customerId }).eq('id', profile.id)
      }
    }

    if (!customerId) return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })

    const subs = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 1 })
    const sub = subs.data[0]
    if (!sub) return NextResponse.json({ error: 'No subscription found for customer' }, { status: 404 })

    const priceId = sub.items.data[0]?.price.id
    const plan = mapPriceToPlan(priceId)
    const credits = PLAN_CREDITS[plan]

    const { error: upErr } = await supabase
      .from('user_profiles')
      .update({
        stripe_subscription_id: sub.id,
        subscription_status: sub.status as any,
        plan,
        credits,
        current_period_end: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null,
      })
      .eq('id', profile.id)

    if (upErr) return NextResponse.json({ error: 'DB update failed', details: upErr }, { status: 500 })

    return NextResponse.json({ success: true, userId: profile.id, plan, credits, subscription_status: sub.status })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'repair failed' }, { status: 500 })
  }
}


