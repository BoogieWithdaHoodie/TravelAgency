const testimonials = [
  {
    quote:
      '“Every detail felt considered, but we still had the freedom to explore. It was exactly the kind of trip we needed.”',
    name: 'Amelia R.',
    trip: 'Paris city escape',
  },
  {
    quote:
      '“Tokyo felt so much more approachable with a thoughtful plan behind us. We came home already talking about going back.”',
    name: 'Daniel & Priya',
    trip: 'Japan discovery trip',
  },
  {
    quote:
      '“The perfect balance of seeing the highlights and finding our own favourite corners. Planning was refreshingly easy.”',
    name: 'Marcus L.',
    trip: 'New York city break',
  },
]

function Testimonials() {
  return (
    <section
      className="section testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="section-heading">
        <p className="eyebrow">A few kind words</p>
        <h2 id="testimonials-heading">Good trips make good stories</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <figure className="testimonial-card" key={testimonial.name}>
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.trip}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
