import { useState, useRef } from "react"
import { MapPin, Calendar, Users, Car, Send, Loader, Navigation, X, Crosshair } from "lucide-react"
import axios from "axios"
import { API_URL } from "../services/api"
import { useSearchParams } from "react-router-dom"
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
// Note: Replace with your own Mapbox token from https://account.mapbox.com/
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || ""

export default function BookRide() {
  const mapRef = useRef(null)
  const [searchParams] = useSearchParams()
  const agencyIdFromUrl = searchParams.get('agencyId')
  const [formData, setFormData] = useState({
    pickupLocation: "",
    pickupCoordinates: { lat: null, lng: null },
    dropLocation: "",
    dropCoordinates: { lat: null, lng: null },
    dateTime: "",
    vehicleType: "any",
    passengers: 1,
  })
  const [loading, setLoading] = useState(false)
  const [gettingPickupLocation, setGettingPickupLocation] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showMapModal, setShowMapModal] = useState(false)
  const [viewState, setViewState] = useState({
    longitude: 81.8463,
    latitude: 25.4358,
    zoom: 12,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

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
          
          // Reverse geocoding to get address from coordinates
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const address = response.data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            
            setFormData((prev) => ({
              ...prev,
              pickupLocation: address,
              pickupCoordinates: { lat: latitude, lng: longitude },
            }))
          } catch (err) {
            console.error("Reverse geocoding failed:", err)
            setFormData((prev) => ({
              ...prev,
              pickupLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              pickupCoordinates: { lat: latitude, lng: longitude },
            }))
          } finally {
            setGettingPickupLocation(false)
          }
        },
        (error) => {
          setError("Unable to get your location. Please enable location services or enter manually.")
          console.error(error)
          setGettingPickupLocation(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setGettingPickupLocation(false)
    }
  }

  const searchDestination = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      // Use Mapbox Geocoding API
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5`
      )
      setSearchResults(response.data.features || [])
    } catch (err) {
      console.error("Search failed:", err)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    searchDestination(value)
  }

  const selectDestinationFromSearch = (place) => {
    const [lng, lat] = place.center
    
    // Fly to the selected location
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 2000,
      })
    }

    // Update view state
    setViewState({
      longitude: lng,
      latitude: lat,
      zoom: 14,
    })

    // Get address for the center location
    reverseGeocodeCenter(lat, lng)
    
    setSearchQuery("")
    setSearchResults([])
  }

  const reverseGeocodeCenter = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      )
      const address = response.data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      
      setFormData((prev) => ({
        ...prev,
        dropLocation: address,
        dropCoordinates: { lat, lng },
      }))
    } catch (err) {
      console.error("Reverse geocoding failed:", err)
      setFormData((prev) => ({
        ...prev,
        dropLocation: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        dropCoordinates: { lat, lng },
      }))
    }
  }

  const handleMapMove = () => {
    // Get the center of the map when user stops moving
    if (mapRef.current) {
      const center = mapRef.current.getCenter()
      reverseGeocodeCenter(center.lat, center.lng)
    }
  }

  const confirmCenterLocation = () => {
    // Use the current center of the map as the drop location
    if (mapRef.current) {
      const center = mapRef.current.getCenter()
      reverseGeocodeCenter(center.lat, center.lng)
    }
  }

  const openMapModal = () => {
    setShowMapModal(true)
    // Center map on pickup location if available, otherwise use default
    if (formData.pickupCoordinates.lat && formData.pickupCoordinates.lng) {
      setViewState({
        longitude: formData.pickupCoordinates.lng,
        latitude: formData.pickupCoordinates.lat,
        zoom: 12,
      })
    } else if (formData.dropCoordinates.lat && formData.dropCoordinates.lng) {
      setViewState({
        longitude: formData.dropCoordinates.lng,
        latitude: formData.dropCoordinates.lat,
        zoom: 14,
      })
    }
  }

  const closeMapModal = () => {
    setShowMapModal(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.pickupCoordinates.lat || !formData.pickupCoordinates.lng) {
      setError("Please get your pickup location using GPS")
      setLoading(false)
      return
    }
    
    try {
      const token = localStorage.getItem("token")
      const bookingData = {
        pickupLocation: formData.pickupLocation,
        pickupCoordinates: formData.pickupCoordinates,
        dropLocation: formData.dropLocation,
        dropCoordinates: formData.dropCoordinates,
        dateTime: formData.dateTime,
        vehicleType: formData.vehicleType,
        passengers: formData.passengers,
      }

      // Add agency ID if provided in URL
      if (agencyIdFromUrl) {
        bookingData.agencyId = agencyIdFromUrl
      }

      await axios.post(
        `${API_URL}/bookings`,
        bookingData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setSuccess(true)
      setFormData({
        pickupLocation: "",
        pickupCoordinates: { lat: null, lng: null },
        dropLocation: "",
        dropCoordinates: { lat: null, lng: null },
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
                      Use Current Location (GPS)
                    </>
                  )}
                </button>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Or enter pickup address manually"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
                {formData.pickupCoordinates.lat && formData.pickupCoordinates.lng && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                    ✓ GPS Location Captured: {formData.pickupCoordinates.lat.toFixed(6)}, {formData.pickupCoordinates.lng.toFixed(6)}
                  </div>
                )}
              </div>
            </div>

            {/* Drop Location */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <MapPin className="inline mr-2" size={16} />
                Drop Location *
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={openMapModal}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500 text-green-700 rounded-xl hover:bg-green-500/20 transition-all"
                >
                  <MapPin size={20} />
                  Select on Map
                </button>
                <input
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  placeholder="Or enter destination address manually"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
                {formData.dropCoordinates.lat && formData.dropCoordinates.lng && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                    ✓ Drop Location Set: {formData.dropCoordinates.lat.toFixed(6)}, {formData.dropCoordinates.lng.toFixed(6)}
                  </div>
                )}
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

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-white rounded-2xl shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">Select Drop Location</h3>
              <button
                onClick={closeMapModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for a place..."
                  className="w-full px-4 py-3 pl-10 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                {searching && (
                  <Loader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary" size={20} />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((place, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectDestinationFromSearch(place)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="font-medium text-foreground">{place.text}</div>
                      <div className="text-sm text-foreground/60">{place.place_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                onMoveEnd={handleMapMove}
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
              >
                <NavigationControl position="top-right" />
                
                {/* Pickup Marker */}
                {formData.pickupCoordinates.lat && formData.pickupCoordinates.lng && (
                  <Marker
                    longitude={formData.pickupCoordinates.lng}
                    latitude={formData.pickupCoordinates.lat}
                    anchor="bottom"
                  >
                    <div className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <Navigation size={14} />
                      Pickup
                    </div>
                  </Marker>
                )}
              </Map>

              {/* Center Crosshair Marker - Always visible */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                <div className="relative">
                  {/* Animated pulse ring */}
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
                  
                  {/* Pin marker */}
                  <div className="relative bg-green-500 text-white p-3 rounded-full shadow-2xl">
                    <MapPin size={28} fill="white" className="drop-shadow-lg" />
                  </div>
                  
                  {/* Shadow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-8 h-2 bg-black/20 rounded-full blur-sm"></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crosshair className="text-green-500" size={20} />
                  <p className="text-sm font-semibold text-foreground">
                    Move the map to select your drop location
                  </p>
                </div>
                <p className="text-xs text-foreground/60 mb-3">
                  Drag the map or search for a place. The center pin shows your selected location.
                </p>
                {formData.dropLocation && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-green-600">Selected Location:</p>
                    <p className="text-sm text-foreground mt-1">{formData.dropLocation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={confirmCenterLocation}
                className="px-6 py-2 border border-green-500 text-green-600 font-medium rounded-xl hover:bg-green-50 transition-all flex items-center gap-2"
              >
                <Crosshair size={18} />
                Set Center as Location
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeMapModal}
                  className="px-6 py-2 border border-border text-foreground font-medium rounded-xl hover:bg-foreground/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={closeMapModal}
                  disabled={!formData.dropCoordinates.lat || !formData.dropCoordinates.lng}
                  className="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
