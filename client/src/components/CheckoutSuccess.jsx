import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import { formatPrice } from '../lib/format.js'
import { useSession } from '../lib/auth-client.js'

function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const orderIdFromUrl = searchParams.get('order_id')
  const { data: session, isPending: isSessionPending } = useSession()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    if (isSessionPending) {
      return undefined
    }

    if (!session?.user) {
      setError('Sign in to view this order.')
      setIsPolling(false)
      return undefined
    }

    const orderId = orderIdFromUrl
      || sessionStorage.getItem('meridian-checkout-order-id')
    if (!orderId) {
      setError('This checkout order could not be found.')
      setIsPolling(false)
      return undefined
    }

    const controller = new AbortController()
    let attempts = 0
    let timeoutId
    let active = true

    async function checkOrder() {
      if (!active || attempts >= 10) {
        if (active && attempts >= 10) {
          setIsPolling(false)
        }
        return
      }

      attempts += 1

      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderId)}`,
          {
            credentials: 'include',
            signal: controller.signal,
          },
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Order lookup failed (${response.status}).`)
        }

        if (!active || controller.signal.aborted) {
          return
        }

        setOrder(data)

        if (data.status === 'paid') {
          sessionStorage.removeItem('meridian-checkout-order-id')
          setIsPolling(false)
          return
        }

        timeoutId = window.setTimeout(checkOrder, 1000)
      } catch (lookupError) {
        if (!controller.signal.aborted && active) {
          setError(lookupError.message || 'Could not check the order.')
          setIsPolling(false)
        }
      }
    }

    checkOrder()

    return () => {
      active = false
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [isSessionPending, session?.user, orderIdFromUrl])

  const isPaid = order?.status === 'paid'
  const statusText = isPaid
    ? 'Payment confirmed'
    : isPolling
      ? 'Checking payment status...'
      : 'Payment is still processing'

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-12 sm:px-6">
        <section className="w-full border border-travel-border bg-travel-surface p-8 text-center sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-travel-accent">
            {sessionId ? 'Checkout complete' : 'Checkout status'}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-travel-ink">
            {statusText}
          </h1>

          {isPolling && !error && (
            <p className="mt-5 text-travel-muted" role="status">
              Waiting for Stripe to confirm your payment.
            </p>
          )}

          {isPaid && (
            <>
              <p className="mt-5 text-travel-muted">
                Your order is confirmed. A confirmation has been recorded in Meridian Journeys.
              </p>
              <p className="mt-4 text-2xl font-semibold text-travel-primary">
                {formatPrice(order.totalAmount / 100)}
              </p>
              <p className="mt-2 text-sm text-travel-muted">
                Order {order.id}
              </p>
            </>
          )}

          {error && (
            <p className="mt-5 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}

          {!isPaid && !isPolling && !error && (
            <p className="mt-5 text-travel-muted">
              The webhook has not confirmed payment yet. You may refresh this page after a moment.
            </p>
          )}

          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-sm bg-travel-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-travel-primary-dark"
            to="/#destinations"
          >
            Browse destinations
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default CheckoutSuccess
