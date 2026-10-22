import { createAuthClient } from 'better-auth/react'

// Use this site's origin so the Vite /api proxy can forward requests to Express.
export const authClient = createAuthClient({
  baseURL: window.location.origin,
})

// Export the auth methods for convenient use in React components.
export const { signIn, signOut, signUp, useSession } = authClient