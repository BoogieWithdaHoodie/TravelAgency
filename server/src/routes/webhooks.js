import express from 'express'
import { and, eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { db } from '../db/index.js'
import { orders } from '../db/schema.js'

const router = express.Router()
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is required for webhooks.')
}

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required for webhook verification.')
}

const stripe = new Stripe(stripeSecretKey)

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature']

    let event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      )
    } catch (error) {
      console.error('Stripe webhook signature verification failed:', error.message)
      return res.status(400).json({ error: 'Invalid Stripe signature.' })
    }

    if (event.type !== 'checkout.session.completed') {
      return res.json({ received: true })
    }

    const session = event.data.object
    const orderId = session.metadata?.orderId

    if (!orderId || session.payment_status !== 'paid') {
      return res.json({ received: true })
    }

    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null

    await db
      .update(orders)
      .set({
        status: 'paid',
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        updatedAt: new Date(),
      })
      .where(and(
        eq(orders.id, orderId),
        eq(orders.status, 'pending'),
      ))

    res.json({ received: true })
  },
)

export default router
