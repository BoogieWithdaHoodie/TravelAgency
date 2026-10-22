import { db } from './index.js'
import { destinationsData } from './destinations.data.js'
import { destinations } from './schema.js'

async function seedDestinations() {
  try {
    await db.insert(destinations)
      .values(destinationsData)
      .onConflictDoNothing()

    console.log(`Seeded ${destinationsData.length} destination records.`)
  } finally {
    await db.$client.end()
  }
}

seedDestinations().catch((error) => {
  console.error('Failed to seed destinations:', error)
  process.exitCode = 1
})