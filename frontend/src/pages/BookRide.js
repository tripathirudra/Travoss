import { useState } from "react"
import { MapPin, Calendar, Users, Car, Send, Loader, Navigation } from "lucide-react"
import api from "../services/api"
import axios from "axios"
import { useSearchParams } from "react-router-dom"
import LocationAutocomplete from "../components/LocationAutocomplete"
import PaymentGateway from "../components/PaymentGateway"

export default function BookRide() {
  const [searchParams] = useSearchParams()
  const agencyIdFromUrl = searchParams.get('agencyId')
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    dateTime: "",
    vehicleType: "any",
    passengers: 1,
  })
  const [loading, setLoading] = useState(false)
  const [gettingPickupLocation, setGettingPickupLocation] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [lastBookingId, setLastBookingId] = useState(null)
  const [amountToPay, setAmountToPay] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getPickupLocation = () => {
    setGettingPickupLocation(true)
    setError("")

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const address = response.data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            setFormData((prev) => ({ ...prev, pickupLocation: address }))
          } catch (err) {
            setFormData((prev) => ({ ...prev, pickupLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }))
          } finally {
            setGettingPickupLocation(false)
          }
        },
        (error) => {
          setError("Unable to get your location using GPS. You can still enter it manually below.")
          setGettingPickupLocation(false)
        }
      )
    } else {
      setError("Geolocation is not supported. Please type your location.")
      setGettingPickupLocation(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!formData.pickupLocation.trim() || !formData.dropLocation.trim()) {
      setError("Please enter both pickup and drop locations")
      setLoading(false)
      return
    }
    
    try {
      const bookingData = {
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        dateTime: formData.dateTime,
        vehicleType: formData.vehicleType,
        passengers: formData.passengers,
      }

      // Add agency ID if provided in URL
      if (agencyIdFromUrl) {
        bookingData.agencyId = agencyIdFromUrl
      }

      const response = await api.post(
        `/bookings`,
        bookingData
      )
      
      const newBooking = response.data.data
      setLastBookingId(newBooking._id)
      setAmountToPay(newBooking.estimatedPrice || 1250) // Fallback amount
      setShowPayment(true)
      setFormData({
        pickupLocation: "",
        dropLocation: "",
        dateTime: "",
        vehicleType: "any",
        passengers: 1,
      })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Booking Form */}
        <div className="bg-white rounded-3xl border border-border shadow-lg p-8 mb-8">
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 flex items-center gap-2">
              <span>✓</span>
              Ride request sent successfully! Agencies will respond soon.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <MapPin className="inline mr-2" size={16} />
                Pickup Location *
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={getPickupLocation}
                  disabled={gettingPickupLocation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 border border-primary text-primary rounded-xl hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  {gettingPickupLocation ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Getting Your Location...
                    </>
                  ) : (
                    <>
                      <Navigation size={20} />
                      Get Current Location (GPS)
                    </>
                  )}
                </button>
                <LocationAutocomplete
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Enter pickup address or choose from suggestions"
                  required
                />
              </div>
            </div>

            {/* Drop Location */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <MapPin className="inline mr-2" size={16} />
                Drop Location *
              </label>
              <div className="space-y-2">
                <LocationAutocomplete
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  placeholder="Enter destination or choose from suggestions"
                  required
                  icon={MapPin}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Calendar className="inline mr-2" size={16} />
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Car className="inline mr-2" size={16} />
                Vehicle Type *
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              >
                <option value="any">Any Available</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="van">Van</option>
                <option value="traveller">Traveller</option>
                <option value="bus">Bus</option>
              </select>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Users className="inline mr-2" size={16} />
                Number of Passengers *
              </label>
              <input
                type="number"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending Request...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Request Ride
                </>
              )}
            </button>
          </form>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
          <h3 className="font-bold text-foreground mb-3">How it works:</h3>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li>• Fill in your ride details above</li>
            <li>• Your request will be sent to nearby verified agencies</li>
            <li>• Agencies will respond with their offers and pricing</li>
            <li>• Choose the best option and confirm your ride</li>
            <li>• Track your booking in real-time</li>
          </ul>
        </div>
      </div>

      <PaymentGateway
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={amountToPay}
        bookingId={lastBookingId}
        onPaymentSuccess={() => {
          setSuccess(true)
          setFormData({
            pickupLocation: "",
            dropLocation: "",
            dateTime: "",
            vehicleType: "any",
            passengers: 1,
          })
          setTimeout(() => setSuccess(false), 5000)
        }}
      />
    </main>
  )
}
