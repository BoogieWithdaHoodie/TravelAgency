import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { db } from '../db/index.js'
import { destinations, orderItems, orders } from '../db/schema.js'
import { requireUser } from '../middleware/require-user.js'

const router = Router()
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const clientUrl = process.env.CLIENT_URL

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is required for checkout.')
}

if (!clientUrl) {
  throw new Error('CLIENT_URL is required for checkout redirect URLs.')
}

const stripe = new Stripe(stripeSecretKey)

router.post('/', requireUser, async (req, res) => {
  const { destinationId } = req.body ?? {}

  if (typeof destinationId !== 'string' || !destinationId.trim()) {
    return res.status(400).json({ error: 'A destination ID is required.' })
  }

  const [destination] = await db
    .select()
    .from(destinations)
    .where(eq(destinations.id, destinationId.trim()))
    .limit(1)

  if (!destination) {
    return res.status(404).json({ error: 'Destination not found.' })
  }

  const quantity = 1
  const unitPriceInCents = destination.price * 100
  const totalAmountInCents = unitPriceInCents * quantity
  const orderId = randomUUID()
  const orderItemId = randomUUID()

  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id: orderId,
      userId: req.user.id,
      status: 'pending',
      totalAmount: totalAmountInCents,
      currency: 'usd',
    })

    await tx.insert(orderItems).values({
      id: orderItemId,
      orderId,
      destinationId: destination.id,
      destinationName: destination.name,
      quantity,
      unitPrice: unitPriceInCents,
    })
  })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: req.user.id,
      line_items: [
        {
          quantity,
          price_data: {
            currency: 'usd',
            unit_amount: unitPriceInCents,
            product_data: {
              name: destination.name,
              description: `${destination.duration}-day trip to ${destination.country}`,
            },
          },
        },
      ],
      metadata: {
        orderId,
        userId: req.user.id,
        destinationId: destination.id,
      },
      success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/destinations/${encodeURIComponent(destination.id)}`,
    })

    await db
      .update(orders)
      .set({
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    res.status(201).json({
      url: session.url,
      orderId,
    })
  } catch (error) {
    console.error('Stripe Checkout Session creation failed:', error)
    return res.status(502).json({ error: 'Could not start Stripe Checkout.' })
  }
})

export default router
