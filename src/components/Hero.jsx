function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <p className="eyebrow">Thoughtful journeys, unforgettable places</p>
        <h1>
          Go somewhere <span>that stays with you.</span>
        </h1>
        <p className="hero-copy">
          From iconic city streets to hidden-away favourites, we make it easier
          to plan a trip that feels like yours.
        </p>
        <a href="#destinations" className="button button-light">
          Explore our trips
        </a>
      </div>
      <a className="hero-scroll" href="#destinations">
        Discover our destinations <span aria-hidden="true">&darr;</span>
      </a>
    </section>
  )
}

export default Hero