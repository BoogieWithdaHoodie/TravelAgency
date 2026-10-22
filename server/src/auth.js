import 'dotenv/config'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/index.js'
import * as schema from './db/schema.js'

const secret = process.env.BETTER_AUTH_SECRET
const baseURL = process.env.BETTER_AUTH_URL
const clientURL = process.env.CLIENT_URL

if (!secret) {
  throw new Error('BETTER_AUTH_SECRET is required.')
}

if (!baseURL) {
  throw new Error('BETTER_AUTH_URL is required.')
}

if (!clientURL) {
  throw new Error('CLIENT_URL is required to configure trusted origins.')
}

export const auth = betterAuth({
  secret,
  baseURL,
  trustedOrigins: [clientURL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
})