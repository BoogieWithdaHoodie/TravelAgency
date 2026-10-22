// Provide a final contact action for visitors ready to plan a trip.
function TripCTA() {
  return (
    <section id="contact" className="bg-travel-primary px-4 py-16 text-center text-white sm:px-6 sm:py-20">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#efd4a5] sm:text-sm">
        Your next chapter is out there
      </p>
      <h2 className="mx-auto max-w-[720px] text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
        Shall we plan something wonderful?
      </h2>
      <p className="mx-auto mb-7 mt-4 max-w-[540px] text-white/85">
        Tell us what you&apos;re dreaming of, and we&apos;ll help you find your way there.
      </p>
      <a
        href="mailto:info@travelagency.com"
        className="inline-flex min-h-12 items-center justify-center rounded-sm bg-travel-accent px-6 py-3 text-sm font-bold text-[#1f2926] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e6c37e] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Plan your trip
      </a>
    </section>
  )
}

export default TripCTA
