import { and, eq } from 'drizzle-orm'
import { Router } from 'express'
import { db } from '../db/index.js'
import { orders } from '../db/schema.js'
import { requireUser } from '../middleware/require-user.js'

const router = Router()

router.use(requireUser)

router.get('/:orderId', async (req, res) => {
  const [order] = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      currency: orders.currency,
      stripeCheckoutSessionId: orders.stripeCheckoutSessionId,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(and(
      eq(orders.id, req.params.orderId),
      eq(orders.userId, req.user.id),
    ))
    .limit(1)

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' })
  }

  res.json(order)
})

export default router
