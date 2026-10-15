import { useEffect, useMemo, useState } from 'react'
import destinations from '../Data/destinations.js'

function Destinations() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [savedOnly, setSavedOnly] = useState(false)
  const [savedIds, setSavedIds] = useState(() => {
    const storedIds = JSON.parse(localStorage.getItem('savedDestinations') ?? '[]')
    return Array.isArray(storedIds)
      ? storedIds.filter((id) => typeof id === 'string')
      : []
  })
  const categories = [...new Set(destinations.map((destination) => destination.category))]

  useEffect(() => {
    localStorage.setItem('savedDestinations', JSON.stringify(savedIds))
  }, [savedIds])

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matches = destinations.filter((destination) => {
      const matchesSearch = [destination.name, destination.country, destination.category]
        .some((value) => value.toLowerCase().includes(query))

      return matchesSearch
        && (category === 'all' || destination.category === category)
        && (!savedOnly || savedIds.includes(destination.id))
    })

    if (sortBy === 'price-low') return matches.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') return matches.sort((a, b) => b.price - a.price)
    if (sortBy === 'duration') return matches.sort((a, b) => a.duration - b.duration)
    return matches
  }, [category, savedIds, savedOnly, search, sortBy])

  function toggleSaved(id) {
    setSavedIds((currentIds) => (
      currentIds.includes(id)
        ? currentIds.filter((savedId) => savedId !== id)
        : [...currentIds, id]
    ))
  }

  return (
    <section id="destinations" className="section destinations">
      <div className="section-heading">
        <p className="eyebrow">Find your next escape</p>
        <h2>Trips worth looking forward to</h2>
        <p>Carefully planned experiences in places we can&apos;t wait to share with you.</p>
      </div>
      <div className="destination-controls" aria-label="Filter destinations">
        <label className="destination-search">
          <span>Search trips</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try Paris or Japan"
          />
        </label>
        <label>
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="duration">Shortest trip</option>
          </select>
        </label>
        <label className="saved-filter">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(event) => setSavedOnly(event.target.checked)}
          />
          Saved trips ({savedIds.length})
        </label>
      </div>
      <p className="destination-result-count" aria-live="polite">
        Showing {filteredDestinations.length} of {destinations.length} trips
      </p>
      <div className="destination-grid">
        {filteredDestinations.map((destination) => (
          <article className="destination-card" key={destination.id}>
            <div className="destination-image-wrap">
              <img
                src={destination.image}
                alt={destination.name}
                className="destination-image"
              />
              <button
                className={`save-trip${savedIds.includes(destination.id) ? ' is-saved' : ''}`}
                type="button"
                aria-pressed={savedIds.includes(destination.id)}
                aria-label={`${savedIds.includes(destination.id) ? 'Remove' : 'Save'} ${destination.name} ${savedIds.includes(destination.id) ? 'from' : 'to'} saved trips`}
                onClick={() => toggleSaved(destination.id)}
              >
                {savedIds.includes(destination.id) ? '♥ Saved' : '♡ Save trip'}
              </button>
            </div>
            <div className="destination-content">
              <p className="card-kicker">
                {destination.country} · {destination.category}
              </p>
              <h3>{destination.name}</h3>
              <p>{destination.description}</p>
              <ul
                className="package-details"
                aria-label={`${destination.name} package details`}
              >
                <li>
                  <span>Duration</span>
                  <strong>{destination.duration} days</strong>
                </li>
                <li>
                  <span>From</span>
                  <strong>${destination.price.toLocaleString('en-US')}</strong>
                </li>
              </ul>
              <a href="#contact" className="text-link">
                Plan this trip <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      {filteredDestinations.length === 0 && (
        <p className="destination-empty" role="status">
          No trips match those filters. Try a different search or category.
        </p>
      )}
    </section>
  )
}

export default Destinations
