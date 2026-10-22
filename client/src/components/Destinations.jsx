import { useEffect, useState } from 'react'
import { formatPrice } from '../lib/format.js'
import SaveTripToggle from './SaveTripToggle.jsx'

// Fetch, search, filter, sort, and save destinations provided by the API.
function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Keep each control's current value in React so the list updates immediately.
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [savedOnly, setSavedOnly] = useState(false)
  // Initialize saved trips from this browser, then persist changes below.
  const [savedIds, setSavedIds] = useState(() => {
    const storedIds = JSON.parse(localStorage.getItem('savedDestinations') ?? '[]')
    return Array.isArray(storedIds)
      ? storedIds.filter((id) => typeof id === 'string')
      : []
  })

  // Load destination records from the Express API, not the old client-side data file.
  useEffect(() => {
    const controller = new AbortController()

    async function loadDestinations() {
      setIsLoading(true)
      setLoadError('')

      try {
        const response = await fetch('/api/destinations', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`The destinations request failed (${response.status}).`)
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('The destinations API returned an unexpected response.')
        }

        setDestinations(data)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLoadError(error.message || 'Could not load destinations.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadDestinations()

    return () => controller.abort()
  }, [reloadKey])

  // Build filter choices from the data, so new categories appear automatically.
  const categories = [...new Set(destinations.map((destination) => destination.category))]

  // Keep browser storage in sync after the saved-ID state changes.
  useEffect(() => {
    localStorage.setItem('savedDestinations', JSON.stringify(savedIds))
  }, [savedIds])

  // Recalculate the visible trips from the current search and filter choices.
  const query = search.trim().toLowerCase()
  const matchingDestinations = destinations.filter((destination) => {
    const matchesSearch = [destination.name, destination.country, destination.category]
      .some((value) => value.toLowerCase().includes(query))

    return matchesSearch
      && (category === 'all' || destination.category === category)
      && (!savedOnly || savedIds.includes(destination.id))
  })

  const filteredDestinations = [...matchingDestinations]
  if (sortBy === 'price-low') {
    filteredDestinations.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredDestinations.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'duration') {
    filteredDestinations.sort((a, b) => a.duration - b.duration)
  }

  function setDestinationSaved(id, shouldSave) {
    // Use the latest array to avoid losing updates when toggling cards quickly.
    setSavedIds((currentIds) => {
      if (shouldSave) {
        return currentIds.includes(id) ? currentIds : [...currentIds, id]
      }

      return currentIds.filter((savedId) => savedId !== id)
    })
  }

  return (
    <section
      id="destinations"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9b7537] sm:text-sm">
          Find your next escape
        </p>
        <h2 className="text-3xl font-medium leading-tight tracking-[-0.045em] text-travel-ink sm:text-4xl lg:text-5xl">
          Trips worth looking forward to
        </h2>
        <p className="mt-4 text-travel-muted">
          Carefully planned experiences in places we can&apos;t wait to share with you.
        </p>
      </div>
      <div
        className="mb-3 grid min-w-0 grid-cols-1 items-end gap-4 border border-travel-border bg-travel-surface p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
        role="group"
        aria-label="Filter destinations"
      >
        <label className="grid min-w-0 gap-1.5 text-xs font-semibold text-travel-muted sm:col-span-2 lg:col-span-1">
          <span>Search trips</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try Paris or Japan"
            className="min-h-11 min-w-0 w-full rounded-sm border border-travel-border bg-travel-background px-3 py-2 text-sm text-travel-ink placeholder:text-travel-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
          />
        </label>
        <label className="grid min-w-0 gap-1.5 text-xs font-semibold text-travel-muted">
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 min-w-0 w-full rounded-sm border border-travel-border bg-travel-background px-3 py-2 text-sm text-travel-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-1.5 text-xs font-semibold text-travel-muted">
          <span>Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="min-h-11 min-w-0 w-full rounded-sm border border-travel-border bg-travel-background px-3 py-2 text-sm text-travel-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="duration">Shortest trip</option>
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-semibold text-travel-muted">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(event) => setSavedOnly(event.target.checked)}
            className="size-4 accent-travel-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
          />
          Saved trips ({savedIds.length})
        </label>
      </div>
      {isLoading && (
        <p className="py-8 text-center text-travel-muted" role="status">
          Loading destinations...
        </p>
      )}
      {!isLoading && loadError && (
        <div className="bg-travel-surface p-6 text-center" role="alert">
          <p className="text-travel-ink">{loadError}</p>
          <button
            className="mt-4 rounded-sm bg-travel-primary px-4 py-2 font-semibold text-white hover:bg-travel-primary-dark"
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Try again
          </button>
        </div>
      )}
      {!isLoading && !loadError && (
        <>
          <p className="mb-4 text-sm text-travel-muted" aria-live="polite">
            Showing {filteredDestinations.length} of {destinations.length} trips
          </p>
          <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((destination) => (
              <article
                className="flex min-w-0 flex-col overflow-hidden border border-travel-border bg-travel-surface transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgb(24_51_49_/_10%)]"
                key={destination.id}
              >
                <div className="relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="aspect-[16/10] w-full object-cover sm:aspect-[4/3]"
                  />
                  {/* The parent owns saved state; each button receives its value and callback. */}
                  <SaveTripToggle
                    checked={savedIds.includes(destination.id)}
                    destinationName={destination.name}
                    onChange={(shouldSave) =>
                      setDestinationSaved(destination.id, shouldSave)
                    }
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start p-5 sm:p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-travel-muted">
                    {destination.country} · {destination.category}
                  </p>
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-travel-ink">
                    {destination.name}
                  </h3>
                  <p className="mb-5 mt-3 text-sm text-travel-muted">
                    {destination.description}
                  </p>
                  <ul
                    className="mt-auto flex w-full justify-between gap-4 border-y border-travel-border py-4"
                    aria-label={`${destination.name} package details`}
                  >
                    <li className="grid gap-1">
                      <span className="text-xs text-travel-muted">Duration</span>
                      <strong className="text-base font-semibold text-travel-ink">
                        {destination.duration} days
                      </strong>
                    </li>
                    <li className="grid gap-1 text-right">
                      <span className="text-xs text-travel-muted">From</span>
                      <strong className="text-base font-semibold text-travel-ink">
                        {formatPrice(destination.price)}
                      </strong>
                    </li>
                  </ul>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-travel-primary transition-colors hover:text-travel-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
                  >
                    Plan this trip <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {!isLoading && !loadError && filteredDestinations.length === 0 && (
        <p
          className="mt-4 bg-travel-surface p-8 text-center text-travel-muted"
          role="status"
        >
          No trips match those filters. Try a different search or category.
        </p>
      )}
    </section>
  )
}

export default Destinations
