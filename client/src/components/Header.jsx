import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { signOut, useSession } from '../lib/auth-client.js'

function UserIdentity({ name }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5 rounded-full border border-travel-border bg-white px-3 py-1.5 text-sm font-semibold text-travel-primary-dark shadow-sm">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-travel-accent-light text-travel-primary">
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            d="M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="max-w-[min(12rem,60vw)] truncate">{name}</span>
    </span>
  )
}

// Responsive site navigation; React state controls the small-screen menu.
function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authError, setAuthError] = useState('')
  const { data: session, isPending } = useSession()
  const isSignedIn = Boolean(session?.user)
  const accountName = session?.user?.name || session?.user?.email || 'Traveler'

  async function handleSignOut() {
    setAuthError('')

    try {
      const result = await signOut()
      if (result.error) {
        setAuthError(result.error.message || 'Could not sign out. Please try again.')
        return
      }

      setMenuOpen(false)
      navigate('/')
    } catch {
      setAuthError('Could not reach the sign-out service. Please try again.')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-travel-border bg-travel-background">
      <nav
        className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 py-3 sm:px-6 md:flex-nowrap md:gap-4 md:py-0 lg:gap-8"
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
          className={`${menuOpen ? 'flex' : 'hidden'} order-last w-full flex-col gap-2 border-t border-travel-border pt-3 text-sm font-medium text-travel-muted md:order-none md:flex md:w-auto md:flex-row md:items-center md:gap-4 md:border-0 md:pt-0 lg:gap-8`}
          id="primary-nav-links"
        >
          <li><a className="transition-colors hover:text-travel-accent" href="#hero" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a className="transition-colors hover:text-travel-accent" href="#destinations" onClick={() => setMenuOpen(false)}>Destinations</a></li>
          <li><a className="transition-colors hover:text-travel-accent" href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          {!isPending && (isSignedIn ? (
            <>
              <li className="hidden md:flex">
                <UserIdentity name={accountName} />
              </li>
              <li>
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-sm border border-travel-primary px-4 py-2 font-semibold text-travel-primary transition-colors hover:bg-travel-primary hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-sm border border-travel-primary px-4 py-2 font-semibold text-travel-primary transition-colors hover:bg-travel-primary hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-sm bg-travel-accent px-4 py-2 font-bold text-[#1f2926] transition-colors hover:bg-[#e6c37e] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
                  to="/login?mode=signup"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </li>
            </>
          ))}
          <li className="lg:hidden">
            <a className="font-semibold text-travel-primary" href="#contact" onClick={() => setMenuOpen(false)}>
              Plan your trip
            </a>
          </li>
        </ul>
        {isSignedIn && (
          <div className="order-2 basis-full border-t border-travel-border pt-2 md:hidden">
            <UserIdentity name={accountName} />
          </div>
        )}
        <a
          href="#contact"
          className="hidden shrink-0 rounded border border-travel-primary px-4 py-2.5 text-sm font-semibold text-travel-primary transition-colors hover:bg-travel-primary hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent lg:inline-flex"
          onClick={() => setMenuOpen(false)}
        >
          Plan your trip
        </a>
      </nav>
      {authError && (
        <p className="mx-auto max-w-6xl px-4 pb-3 text-sm text-red-800" role="alert">
          {authError}
        </p>
      )}
    </header>
  )
}

export default Header