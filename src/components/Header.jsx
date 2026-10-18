import { useState } from 'react'

// Responsive site navigation; React state controls the small-screen menu.
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-travel-border bg-travel-background">
      <nav
        className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 py-3 sm:px-6 md:flex-nowrap md:gap-8 md:py-0"
        aria-label="Main navigation"
      >
        <a
          href="#hero"
          className="shrink-0 text-xl font-extrabold tracking-[-0.06em] text-travel-primary sm:text-[1.35rem]"
          aria-label="Meridian Journeys home"
        >
          Meridian<span> Journeys</span>
        </a>
        <button
          className="ml-auto inline-flex min-h-10 items-center justify-center rounded border border-travel-border px-3 font-semibold text-travel-primary transition-colors hover:bg-travel-accent-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent md:hidden"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <ul
          className={`${menuOpen ? 'flex' : 'hidden'} order-last w-full flex-col gap-2 border-t border-travel-border pt-3 text-sm font-medium text-travel-muted md:order-none md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:pt-0`}
          id="primary-nav-links"
        >
          <li><a className="transition-colors hover:text-travel-accent" href="#hero" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a className="transition-colors hover:text-travel-accent" href="#destinations" onClick={() => setMenuOpen(false)}>Destinations</a></li>
          <li><a className="transition-colors hover:text-travel-accent" href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li className="md:hidden">
            <a className="font-semibold text-travel-primary" href="#contact" onClick={() => setMenuOpen(false)}>
              Plan your trip
            </a>
          </li>
        </ul>
        <a
          href="#contact"
          className="hidden shrink-0 rounded border border-travel-primary px-4 py-2.5 text-sm font-semibold text-travel-primary transition-colors hover:bg-travel-primary hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent md:inline-flex"
          onClick={() => setMenuOpen(false)}
        >
          Plan your trip
        </a>
      </nav>
    </header>
  )
}

export default Header