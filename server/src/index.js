import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import destinationsRouter from './routes/destinations.js'
import savedDestinationsRouter from './routes/saved-destinations.js'
import checkoutRouter from './routes/checkout.js'
import webhooksRouter from './routes/webhooks.js'
import ordersRouter from './routes/orders.js'

const app = express()
const port = Number(process.env.PORT) || 3000
const clientUrl = process.env.CLIENT_URL

if (!clientUrl) {
  throw new Error('CLIENT_URL is required to configure CORS.')
}

app.use(cors({
  origin: clientUrl,
  credentials: true,
}))

// Mount Better Auth before body-parsing middleware.
app.all('/api/auth/*splat', toNodeHandler(auth))

// Stripe requires the unparsed body to verify its webhook signature.
app.use('/api/webhooks', webhooksRouter)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/destinations', destinationsRouter)
app.use('/api/saved-destinations', savedDestinationsRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/orders', ordersRouter)

// Log server errors and return a generic message to clients.
app.use((error, req, res, next) => {
  console.error('Server error:', error)

  if (res.headersSent) {
    return next(error)
  }

  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)
})