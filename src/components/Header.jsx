import { useState } from 'react'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#hero" className="logo" aria-label="Travel Agency home">
          Travel<span>Agency</span>
        </a>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <ul
          className={`nav-links${menuOpen ? ' is-open' : ''}`}
          id="primary-nav-links"
        >
          <li><a href="#hero" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="#destinations" onClick={() => setMenuOpen(false)}>Destinations</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
        </ul>
        <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>
          Plan your trip
        </a>
      </nav>
    </header>
  )
}

export default Header