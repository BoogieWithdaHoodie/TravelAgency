// Display traveler quotes from a local array using one shared card layout.
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
      className="bg-[#f1f0e9] px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9b7537] sm:text-sm">
            A few kind words
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl font-medium leading-tight tracking-[-0.045em] text-travel-ink sm:text-4xl lg:text-5xl"
          >
            Good trips make good stories
          </h2>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              className="flex min-w-0 flex-col justify-between border border-travel-border bg-travel-background p-6 sm:p-7"
              key={testimonial.name}
            >
              <blockquote className="mb-6 text-base leading-relaxed text-travel-ink">
                {testimonial.quote}
              </blockquote>
              <figcaption className="grid gap-1">
                <strong className="text-sm font-semibold">{testimonial.name}</strong>
                <span className="text-xs text-travel-muted">{testimonial.trip}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
