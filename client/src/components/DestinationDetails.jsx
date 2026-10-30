import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useSession } from '../lib/auth-client.js'
import { formatPrice } from '../lib/format.js'
import SaveTripToggle from './SaveTripToggle.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

function DestinationDetails() {
  const { id } = useParams()
  const { data: session, isPending: isSessionPending } = useSession()
  const userId = session?.user?.id
  const isSignedIn = Boolean(userId)
  const [destination, setDestination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [savedStatus, setSavedStatus] = useState({
    userId: null,
    isSaved: false,
    error: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadDestination() {
      setIsLoading(true)
      setLoadError('')
      setDestination(null)

      try {
        const response = await fetch(
          `/api/destinations/${encodeURIComponent(id)}`,
          { signal: controller.signal },
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Destination request failed (${response.status}).`)
        }

        if (controller.signal.aborted) {
          return
        }

        setDestination(data)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLoadError(error.message || 'Could not load this destination.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadDestination()

    return () => controller.abort()
  }, [id])

  useEffect(() => {
    if (isSessionPending || !userId) {
      return undefined
    }

    const controller = new AbortController()

    async function loadSavedStatus() {
      try {
        const response = await fetch('/api/saved-destinations', {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Saved trips could not be loaded (${response.status}).`)
        }

        const savedIds = await response.json()
        if (!Array.isArray(savedIds) || savedIds.some((savedId) => typeof savedId !== 'string')) {
          throw new Error('The saved trips API returned an unexpected response.')
        }

        if (!controller.signal.aborted) {
          setSavedStatus({
            userId,
            isSaved: savedIds.includes(id),
            error: '',
          })
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          setSavedStatus({
            userId,
            isSaved: false,
            error: error.message || 'Could not load this trip’s saved status.',
          })
        }
      }
    }

    loadSavedStatus()

    return () => controller.abort()
  }, [id, isSessionPending, userId])

  async function handleSavedChange(shouldSave) {
    setIsSaving(true)

    try {
      const response = await fetch(
        shouldSave
          ? '/api/saved-destinations'
          : `/api/saved-destinations/${encodeURIComponent(id)}`,
        {
          method: shouldSave ? 'POST' : 'DELETE',
          credentials: 'include',
          headers: shouldSave ? { 'Content-Type': 'application/json' } : undefined,
          body: shouldSave ? JSON.stringify({ destinationId: id }) : undefined,
        },
      )

      if (!response.ok) {
        throw new Error(`Could not update saved trips (${response.status}).`)
      }

      setSavedStatus({ userId, isSaved: shouldSave, error: '' })
    } catch (error) {
      setSavedStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message || 'Could not update saved trips.',
      }))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCheckout() {
    if (!userId || isCheckingOut) {
      return
    }

    setIsCheckingOut(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destinationId: id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Checkout failed (${response.status}).`)
      }

      if (!data.url) {
        throw new Error('Stripe Checkout returned no redirect URL.')
      }

      window.location.assign(data.url)
    } catch (error) {
      setCheckoutError(error.message || 'Could not start checkout.')
      setIsCheckingOut(false)
    }
  }

  const isSavedStatusLoading = isSignedIn && savedStatus.userId !== userId
  const isSaved = isSignedIn
    && savedStatus.userId === userId
    && savedStatus.isSaved
  const savedError = savedStatus.userId === userId ? savedStatus.error : ''

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />
      <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-travel-primary transition-colors hover:text-travel-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
          to="/#destinations"
        >
          <span aria-hidden="true">&larr;</span> All destinations
        </Link>

        {isLoading && (
          <p className="py-20 text-center text-travel-muted" role="status">
            Loading destination...
          </p>
        )}

        {!isLoading && loadError && (
          <section className="mx-auto max-w-xl border border-travel-border bg-travel-surface p-8 text-center">
            <h1 className="text-2xl font-semibold text-travel-ink">
              Destination unavailable
            </h1>
            <p className="mt-3 text-travel-muted" role="alert">{loadError}</p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-sm bg-travel-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-travel-primary-dark"
              to="/#destinations"
            >
              Browse destinations
            </Link>
          </section>
        )}

        {!isLoading && !loadError && destination && (
          <article className="grid overflow-hidden border border-travel-border bg-travel-surface lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-64 bg-travel-border sm:min-h-96 lg:min-h-full">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src={destination.image}
                alt={destination.name}
              />
              {isSignedIn && (
                <SaveTripToggle
                  checked={isSaved}
                  destinationName={destination.name}
                  disabled={isSavedStatusLoading || isSaving}
                  onChange={handleSavedChange}
                />
              )}
            </div>

            <div className="flex flex-col items-start p-6 sm:p-9 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b7537]">
                {destination.country} · {destination.category}
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-travel-ink sm:text-4xl">
                {destination.name}
              </h1>
              <p className="mt-5 leading-relaxed text-travel-muted">
                {destination.description}
              </p>

              <dl className="mt-8 grid w-full grid-cols-2 border-y border-travel-border py-5">
                <div>
                  <dt className="text-sm text-travel-muted">Trip length</dt>
                  <dd className="mt-1 text-lg font-semibold text-travel-ink">
                    {destination.duration} days
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-sm text-travel-muted">Starting from</dt>
                  <dd className="mt-1 text-lg font-semibold text-travel-ink">
                    {formatPrice(destination.price)}
                  </dd>
                </div>
              </dl>

              {savedError && (
                <p className="mt-4 text-sm text-red-800" role="alert">
                  {savedError}
                </p>
              )}

              {!isSignedIn && !isSessionPending && (
                <Link
                  className="mt-6 text-sm font-semibold text-travel-primary underline-offset-4 hover:underline"
                  to="/login"
                >
                  Sign in to save this trip
                </Link>
              )}

              {isSessionPending && (
                <p className="mt-6 text-sm text-travel-muted" role="status">
                  Checking account...
                </p>
              )}

              {checkoutError && (
                <p className="mt-6 text-sm text-red-800" role="alert">
                  {checkoutError}
                </p>
              )}

              <button
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-travel-accent px-6 py-3 text-sm font-bold text-[#1f2926] transition-colors hover:bg-travel-accent/90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent disabled:cursor-not-allowed disabled:bg-travel-accent/60 disabled:text-[#1f2926]/70 sm:w-auto"
                type="button"
                disabled={!isSignedIn || isSessionPending || isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? 'Starting checkout...' : 'Buy now'}
              </button>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default DestinationDetails
