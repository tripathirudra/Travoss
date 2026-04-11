import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Agencies from "./pages/Agencies"
import Contact from "./pages/Contact"
import Booking from "./pages/Booking"
import UserProfile from "./pages/UserProfile"
import BookRide from "./pages/BookRide"
import AgenciesNearYou from "./pages/AgenciesNearYou"
import ContactSupport from "./pages/ContactSupport"
import AgencyDashboard from "./pages/AgencyDashboard"
import { ThemeProvider } from "./context/ThemeContext"
import "./App.css"

function App() {
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    setAppReady(true)
  }, [])

  if (!appReady) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="app flex flex-col min-h-screen bg-background text-foreground">
          {/* Show navigation only for public and user pages, not for agency dashboard */}
          {!window.location.pathname.startsWith("/agency") && <Navigation />}
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/agencies" element={<Agencies />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* User Dashboard Routes */}
              <Route
                path="/user/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/book-ride"
                element={
                  <PrivateRoute>
                    <BookRide />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/agencies-near-you"
                element={
                  <PrivateRoute>
                    <AgenciesNearYou />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/contact-support"
                element={
                  <PrivateRoute>
                    <ContactSupport />
                  </PrivateRoute>
                }
              />
              
              {/* Legacy booking route */}
              <Route
                path="/booking"
                element={
                  <PrivateRoute>
                    <Booking />
                  </PrivateRoute>
                }
              />

              {/* Agency Dashboard Routes */}
              <Route
                path="/agency/dashboard/*"
                element={
                  <PrivateRoute>
                    <AgencyDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          
          {/* Show footer only for public and user pages, not for agency dashboard */}
          {!window.location.pathname.startsWith("/agency") && <Footer />}
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
