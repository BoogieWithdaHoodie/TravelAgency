// Introduce the travel brand with the hero image and primary page links.
function Hero() {
  return (
    <section
      id="hero"
      className="relative grid min-h-[min(740px,calc(100svh-64px))] place-items-center overflow-hidden bg-travel-primary-dark px-5 py-24 text-white sm:px-8 lg:px-12"
    >
      <img
        src="/images/destinations/hero%20image.avif"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2220]/85 via-[#0d2220]/60 to-[#0d2220]/20" />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-[760px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-travel-accent sm:text-sm">
            Thoughtful journeys, unforgettable places
          </p>
          <h1 className="max-w-[740px] text-5xl font-medium leading-[1.04] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
            Go somewhere <span className="text-[#efd4a5]">that stays with you.</span>
          </h1>
          <p className="mb-8 mt-6 max-w-[540px] text-base leading-relaxed text-white/90 sm:text-lg">
            From iconic city streets to hidden-away favourites, we make it easier
            to plan a trip that feels like yours.
          </p>
          <a
            href="#destinations"
            className="inline-flex min-h-12 items-center justify-center rounded-sm bg-travel-accent px-6 py-3 text-sm font-bold text-[#1f2926] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e6c37e] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
          >
            Explore our trips
          </a>
        </div>
      </div>
      <a
        className="absolute bottom-6 left-5 right-5 z-10 flex items-center justify-between gap-3 text-xs tracking-wide text-white/90 sm:bottom-8 sm:left-auto sm:right-8 sm:w-auto sm:justify-start sm:text-sm lg:right-[max(2rem,calc((100vw-1200px)/2))]"
        href="#destinations"
      >
        Discover our destinations <span className="text-lg text-travel-accent" aria-hidden="true">&darr;</span>
      </a>
    </section>
  )
}

export default Hero