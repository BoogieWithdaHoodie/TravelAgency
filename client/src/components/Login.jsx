import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { signIn, signUp } from '../lib/auth-client.js'

// Allow visitors to sign in or create an account without leaving this page.
function Login() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isSignUp = searchParams.get('mode') === 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const result = isSignUp
        ? await signUp.email({
            name,
            email,
            password,
            callbackURL: '/',
          })
        : await signIn.email({
            email,
            password,
            callbackURL: '/',
          })

      if (result.error) {
        setErrorMessage(
          result.error.message ||
            `${isSignUp ? 'Sign up' : 'Sign in'} failed. Please try again.`,
        )
        return
      }

      navigate('/')
    } catch {
      setErrorMessage(
        `We could not reach the ${isSignUp ? 'sign-up' : 'sign-in'} service. Please try again.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-travel-background lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-travel-primary-dark text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <img
          src="/images/destinations/hero%20image.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-travel-primary-dark/95 via-travel-primary-dark/70 to-travel-primary/40" />
        <Link to="/" className="relative z-10 text-2xl font-extrabold tracking-[-0.06em]">
          Meridian<span className="text-travel-accent"> Journeys</span>
        </Link>
        <div className="relative z-10 max-w-xl py-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-travel-accent">
            Thoughtful journeys, unforgettable places
          </p>
          <h1 className="text-5xl font-medium leading-tight tracking-[-0.05em] xl:text-6xl">
            Your next story starts here.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            {isSignUp
              ? 'Create an account to keep your favourite escapes close and plan trips that feel like yours.'
              : 'Sign in to keep your favourite escapes close and continue planning a trip that feels like yours.'}
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/65">
          Find a little more wonder in every journey.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-12 inline-block text-xl font-extrabold tracking-[-0.06em] text-travel-primary lg:hidden"
          >
            Meridian<span className="text-travel-accent"> Journeys</span>
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9b7537]">
              {isSignUp ? 'Start exploring' : 'Welcome back'}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-travel-ink sm:text-4xl">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-3 text-travel-muted">
              {isSignUp
                ? 'Create an account to save trips and plan your next escape.'
                : 'Enter your details to continue planning your next escape.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-travel-ink">
                  Your name
                </span>
                <input
                  autoComplete="name"
                  className="min-h-12 w-full rounded-sm border border-travel-border bg-white px-4 py-3 text-travel-ink placeholder:text-travel-muted/70 focus:border-travel-primary focus:outline-none focus:ring-2 focus:ring-travel-primary/20"
                  name="name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                  value={name}
                />
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-travel-ink">
                Email address
              </span>
              <input
                autoComplete="email"
                className="min-h-12 w-full rounded-sm border border-travel-border bg-white px-4 py-3 text-travel-ink placeholder:text-travel-muted/70 focus:border-travel-primary focus:outline-none focus:ring-2 focus:ring-travel-primary/20"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-travel-ink">
                Password
              </span>
              <input
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="min-h-12 w-full rounded-sm border border-travel-border bg-white px-4 py-3 text-travel-ink placeholder:text-travel-muted/70 focus:border-travel-primary focus:outline-none focus:ring-2 focus:ring-travel-primary/20"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </label>

            {errorMessage && (
              <p
                className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <button
              className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-travel-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-travel-primary-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? isSignUp ? 'Creating account...' : 'Signing in...'
                : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-travel-muted">
            {isSignUp ? 'Already have an account? ' : 'New to Meridian Journeys? '}
            <button
              className="font-semibold text-travel-primary transition-colors hover:text-travel-accent"
              type="button"
              onClick={() => {
                setSearchParams(isSignUp ? {} : { mode: 'signup' })
                setErrorMessage('')
              }}
            >
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
            <span className="mt-3 block">
              <Link
                className="font-medium text-travel-muted underline-offset-4 hover:underline"
                to="/"
              >
                Back to exploring destinations
              </Link>
            </span>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login