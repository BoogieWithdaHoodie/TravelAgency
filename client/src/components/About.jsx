// Explain the agency's planning approach and personal-travel promise.
function About() {
  return (
    <section
      id="about"
      className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-20"
    >
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9b7537] sm:text-sm">
          A little about us
        </p>
        <h2 className="text-3xl font-medium leading-tight tracking-[-0.045em] text-travel-ink sm:text-4xl lg:text-5xl">
          Travel should feel like it was made for you.
        </h2>
        <p className="mt-5 text-travel-muted">
          We believe the best journeys leave room for the unexpected. Our team
          brings local insight and thoughtful planning together, so you can
          spend less time sorting details and more time enjoying the place
          you&apos;re in.
        </p>
        <a
          href="#contact"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-travel-primary transition-colors hover:text-travel-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent"
        >
          Let&apos;s start planning <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="bg-travel-accent-light p-6 sm:p-8">
        <span
          className="mb-5 grid size-12 place-items-center rounded-full bg-travel-primary font-serif text-2xl text-white"
          aria-hidden="true"
        >
          T
        </span>
        <p className="text-lg font-medium leading-relaxed text-travel-primary-dark sm:text-xl">
          Considered itineraries. Personal recommendations. More time for the
          moments that matter.
        </p>
      </div>
    </section>
  )
}

export default About
