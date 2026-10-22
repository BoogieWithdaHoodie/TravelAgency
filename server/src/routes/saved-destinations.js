import { Router } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { and, eq } from 'drizzle-orm'
import { auth } from '../auth.js'
import { db } from '../db/index.js'
import { destinations, savedDestinations } from '../db/schema.js'

const router = Router()

router.use(async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session?.user) {
    return res.status(401).json({ error: 'Sign in to manage saved trips.' })
  }

  req.user = session.user
  next()
})

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
