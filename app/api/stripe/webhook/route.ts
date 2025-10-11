import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Mapping des crédits par plan
const PLAN_CREDITS: Record<string, number> = {
  starter: 30,
  professional: 100,
  enterprise: 999999, // Illimité
}

// Mapping des Price IDs vers les plans
const PRICE_TO_PLAN: Record<string, string> = {
  ...(process.env.STRIPE_STARTER_PRICE_ID ? { [process.env.STRIPE_STARTER_PRICE_ID]: 'starter' } : {}),
  ...(process.env.STRIPE_PROFESSIONAL_PRICE_ID ? { [process.env.STRIPE_PROFESSIONAL_PRICE_ID]: 'professional' } : {}),
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!userId) {
          console.error('No user ID in session metadata')
          break
        }

        // Récupérer la subscription pour obtenir le price_id
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        console.log('[webhook] sub.current_period_end =', (subscription as any)?.current_period_end)
        const priceId = subscription.items.data[0]?.price.id
        const plan = PRICE_TO_PLAN[priceId] || 'starter'
        const credits = PLAN_CREDITS[plan] || PLAN_CREDITS['starter']

        // Mettre à jour le profil utilisateur
        const periodEnd = (subscription as any)?.current_period_end
          ? new Date((subscription as any).current_period_end * 1000).toISOString()
          : null

        const { error: upErr } = await supabase
          .from('user_profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            plan: plan,
            credits: credits,
            current_period_end: periodEnd,
          })
          .eq('id', userId)

        if (upErr) {
          console.error('Supabase update error (checkout.session.completed):', upErr)
        }

        console.log(`✅ User ${userId} subscribed to ${plan} with ${credits} credits`)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        // Récupérer l'utilisateur via subscription_id
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, plan')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (!profile) {
          console.error('No profile found for subscription:', subscriptionId)
          break
        }

        // Recharger les crédits mensuels
        const credits = PLAN_CREDITS[profile.plan] || 30

        await supabase
          .from('user_profiles')
          .update({
            credits: credits,
            subscription_status: 'active',
          })
          .eq('id', profile.id)

        console.log(`✅ Credits recharged for user ${profile.id}: ${credits} credits`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) break

        const { error: upErr2 } = await supabase
          .from('user_profiles')
          .update({
            subscription_status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', profile.id)

        if (upErr2) {
          console.error('Supabase update error (subscription.updated):', upErr2)
        }

        console.log(`✅ Subscription updated for user ${profile.id}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) break

        const { error: upErr3 } = await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'canceled',
            plan: null,
            credits: 0,
          })
          .eq('id', profile.id)

        if (upErr3) {
          console.error('Supabase update error (subscription.deleted):', upErr3)
        }

        console.log(`✅ Subscription canceled for user ${profile.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

