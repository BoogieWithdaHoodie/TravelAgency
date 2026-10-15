function Footer() {
  return (
    <footer className="bg-travel-primary-dark px-4 pb-6 pt-12 text-white sm:px-6 sm:pt-14">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.2fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <a
            href="#hero"
            className="text-xl font-extrabold tracking-[-0.06em] text-white"
          >
            Travel<span>Agency</span>
          </a>
          <p className="mt-3 text-sm text-white/75">
            Thoughtful journeys, unforgettable places.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold">Explore</h2>
          <ul className="grid content-start gap-2 text-sm text-white/75">
            <li><a className="transition-colors hover:text-travel-accent" href="#hero">Home</a></li>
            <li><a className="transition-colors hover:text-travel-accent" href="#destinations">Destinations</a></li>
            <li><a className="transition-colors hover:text-travel-accent" href="#about">About us</a></li>
          </ul>
        </div>
        <div className="grid content-start gap-2 text-sm text-white/75">
          <h2 className="mb-1 text-sm font-bold text-white">Get in touch</h2>
          <a className="break-words transition-colors hover:text-travel-accent" href="mailto:info@travelagency.com">
            info@travelagency.com
          </a>
          <a className="transition-colors hover:text-travel-accent" href="tel:+11234567890">
            +1 (123) 456-7890
          </a>
          <p>123 Travel St, Adventure City</p>
        </div>
      </div>
      <p className="mx-auto mt-8 w-full max-w-6xl border-t border-white/20 pt-5 text-xs text-white/60">
        &copy; 2026 Travel Agency. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
