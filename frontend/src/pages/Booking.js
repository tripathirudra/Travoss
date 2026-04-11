import { useState } from "react"
import { MapPin, Calendar, Users, Plane, ArrowLeftRight, Search } from "lucide-react"
import { bookingService } from "../services/api"

export default function Booking() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    travelType: "round-trip",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            from: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }))
        },
        (err) => {
          setError("Unable to access your location")
          setTimeout(() => setError(""), 3000)
        }
      )
    }
  }

  const handleSwapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      await bookingService.create({
        userId: user.id,
        ...formData,
      })
      setSuccess("Booking request submitted successfully! We'll contact you shortly with available options.")
      setFormData({ 
        from: "", 
        to: "", 
        departureDate: "", 
        returnDate: "", 
        passengers: 1,
        travelType: "round-trip"
      })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  const popularDestinations = [
    { name: "Goa", emoji: "🏖️" },
    { name: "Kashmir", emoji: "🏔️" },
    { name: "Kerala", emoji: "🌴" },
    { name: "Rajasthan", emoji: "🏰" },
    { name: "Manali", emoji: "⛰️" },
    { name: "Mumbai", emoji: "🏙️" },
  ]

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <main className="pt-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plan Your Perfect Journey</h1>
            <p className="text-xl text-white/90">Search and book your dream destination</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Travel Type Selector */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-border">
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, travelType: "round-trip" }))}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                formData.travelType === "round-trip"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
              }`}
            >
              Round Trip
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, travelType: "one-way" }))}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                formData.travelType === "one-way"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
              }`}
            >
              One Way
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 flex items-center gap-2">
              <span>✓</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From/To Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <div className="flex items-center gap-2">
                    <Plane className="rotate-45" size={18} />
                    From
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    placeholder="Enter departure city"
                    className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12 text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleLocationSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-primary transition-colors p-2"
                    title="Use current location"
                  >
                    <MapPin size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    To
                  </div>
                </label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="Enter destination city"
                  className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
                  required
                />
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwapLocations}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-lg z-10 hidden md:flex items-center justify-center"
                title="Swap locations"
              >
                <ArrowLeftRight size={20} />
              </button>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    Departure Date
                  </div>
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  min={getTodayDate()}
                  className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
                  required
                />
              </div>
              {formData.travelType === "round-trip" && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      Return Date
                    </div>
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    min={formData.departureDate || getTodayDate()}
                    className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
                  />
                </div>
              )}
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  Number of Travelers
                </div>
              </label>
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Traveler" : "Travelers"}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-5 gradient-primary text-white font-bold rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Search size={24} />
                  Search Travel Options
                </>
              )}
            </button>
          </form>
        </div>

        {/* Popular Destinations */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-border shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, to: dest.name }))}
                className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all text-center group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{dest.emoji}</div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {dest.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-border text-center hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold text-foreground mb-2">Best Price</h3>
            <p className="text-sm text-foreground/70">Get competitive prices from multiple agencies</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border text-center hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-foreground mb-2">Secure Booking</h3>
            <p className="text-sm text-foreground/70">Your data and payment are 100% secure</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border text-center hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">🎧</div>
            <h3 className="font-bold text-foreground mb-2">24/7 Support</h3>
            <p className="text-sm text-foreground/70">Our team is always here to help you</p>
          </div>
        </div>
      </section>
    </main>
  )
}
