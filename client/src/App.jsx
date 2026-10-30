import { Navigate, Route, Routes } from 'react-router'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Destinations from './components/Destinations.jsx'
import Testimonials from './components/Testimonials.jsx'
import About from './components/About.jsx'
import TripCTA from './components/TripCTA.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/Login.jsx'
import DestinationDetails from './components/DestinationDetails.jsx'
import CheckoutSuccess from './components/CheckoutSuccess.jsx'

// Compose the public landing page from its independent sections.
function HomePage() {
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

// Define the landing page and authentication page routes.
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/destinations/:id" element={<DestinationDetails />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
