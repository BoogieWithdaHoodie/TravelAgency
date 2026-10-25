import { Router } from 'express'
import { asc, eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { destinations } from '../db/schema.js'

const router = Router()

router.get('/', async (req, res) => {
  const results = await db
    .select()
    .from(destinations)
    .orderBy(asc(destinations.name))

  res.json(results)
})

router.get('/:id', async (req, res) => {
  const [destination] = await db
    .select()
    .from(destinations)
    .where(eq(destinations.id, req.params.id))
    .limit(1)

  if (!destination) {
    return res.status(404).json({ error: 'Destination not found.' })
  }

  res.json(destination)
})

export default router