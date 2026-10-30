import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../auth.js'

export async function requireUser(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (!session?.user) {
      return res.status(401).json({ error: 'Sign in to continue.' })
    }

    req.user = session.user
    req.session = session.session
    next()
  } catch (error) {
    next(error)
  }
}
