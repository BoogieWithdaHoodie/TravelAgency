import { Router } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { destinations, savedDestinations } from '../db/schema.js'
import { requireUser } from '../middleware/require-user.js'

const router = Router()

router.use(requireUser)

router.get('/', async (req, res) => {
  const savedTrips = await db
    .select({ destinationId: savedDestinations.destinationId })
    .from(savedDestinations)
    .where(eq(savedDestinations.userId, req.user.id))

  res.json(savedTrips.map(({ destinationId }) => destinationId))
})

router.post('/', async (req, res) => {
  const { destinationId } = req.body ?? {}
  if (typeof destinationId !== 'string' || !destinationId.trim()) {
    return res.status(400).json({ error: 'A destination ID is required.' })
  }

  const [destination] = await db
    .select({ id: destinations.id })
    .from(destinations)
    .where(eq(destinations.id, destinationId))
    .limit(1)

  if (!destination) {
    return res.status(404).json({ error: 'Destination not found.' })
  }

  await db
    .insert(savedDestinations)
    .values({
      userId: req.user.id,
      destinationId,
    })
    .onConflictDoNothing()

  res.status(201).json({ destinationId })
})

router.delete('/:destinationId', async (req, res) => {
  await db
    .delete(savedDestinations)
    .where(and(
      eq(savedDestinations.userId, req.user.id),
      eq(savedDestinations.destinationId, req.params.destinationId),
    ))

  res.status(204).end()
})

export default router
