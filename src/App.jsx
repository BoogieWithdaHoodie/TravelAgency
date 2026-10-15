import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Destinations from './components/Destinations.jsx'
import Testimonials from './components/Testimonials.jsx'
import About from './components/About.jsx'
import TripCTA from './components/TripCTA.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />
      <main>
        <Hero />
        <Destinations />
        <Testimonials />
        <About />
        <TripCTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
