import { Router } from 'express'
import { asc } from 'drizzle-orm'
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

export default router