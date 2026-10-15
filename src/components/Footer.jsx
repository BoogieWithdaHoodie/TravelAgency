function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#hero" className="logo">
            Travel<span>Agency</span>
          </a>
          <p>Thoughtful journeys, unforgettable places.</p>
        </div>
        <div className="footer-links">
          <h2>Explore</h2>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#destinations">Destinations</a></li>
            <li><a href="#about">About us</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h2>Get in touch</h2>
          <a href="mailto:info@travelagency.com">info@travelagency.com</a>
          <a href="tel:+11234567890">+1 (123) 456-7890</a>
          <p>123 Travel St, Adventure City</p>
        </div>
      </div>
      <p className="copyright">
        &copy; 2026 Travel Agency. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
