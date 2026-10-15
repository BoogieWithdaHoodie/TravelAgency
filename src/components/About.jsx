function About() {
  return (
    <section id="about" className="section about">
      <div className="about-copy">
        <p className="eyebrow">A little about us</p>
        <h2>Travel should feel like it was made for you.</h2>
        <p>
          We believe the best journeys leave room for the unexpected. Our team
          brings local insight and thoughtful planning together, so you can
          spend less time sorting details and more time enjoying the place
          you&apos;re in.
        </p>
        <a href="#contact" className="text-link">
          Let&apos;s start planning <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="about-note">
        <span className="about-mark" aria-hidden="true">T</span>
        <p>
          Considered itineraries. Personal recommendations. More time for the
          moments that matter.
        </p>
      </div>
    </section>
  )
}

export default About
