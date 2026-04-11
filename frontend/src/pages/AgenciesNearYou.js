import { useState, useEffect } from "react"
import { MapPin, Search, Star, Phone, Car, AlertCircle, Loader } from "lucide-react"
import { agencyService } from "../services/api"
import { useNavigate } from "react-router-dom"

export default function AgenciesNearYou() {
  const [searchLocation, setSearchLocation] = useState("")
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Load all agencies on initial mount
    fetchAllAgencies()
  }, [])

  const fetchAllAgencies = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await agencyService.getAll()
      setAgencies(response.data)
    } catch (err) {
      setError("Failed to load agencies. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    setLoading(true)
    setError("")
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setSearchLocation(`Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`)
          
          try {
            const response = await agencyService.getNearby(latitude, longitude)
            setAgencies(response.data)
          } catch (err) {
            setError("Failed to fetch nearby agencies.")
            console.error(err)
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.")
          console.error(error)
          setLoading(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
    }
  }

  const handleBookNow = (agencyId) => {
    // Navigate to book ride page with agency ID in URL
    navigate(`/user/book-ride?agencyId=${agencyId}`)
  }

  return (
    <main className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-border shadow-lg p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-6 py-3 bg-primary/10 border border-primary text-primary font-medium rounded-xl hover:bg-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <MapPin size={20} />
              Current Location
            </button>
            <button 
              onClick={fetchAllAgencies}
              disabled={loading}
              className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-primary" size={48} />
          </div>
        )}

        {/* No Results */}
        {!loading && agencies.length === 0 && (
          <div className="text-center py-20">
            <Car className="mx-auto mb-4 text-foreground/40" size={64} />
            <h3 className="text-xl font-bold text-foreground mb-2">No Agencies Found</h3>
            <p className="text-foreground/60">Try searching in a different location</p>
          </div>
        )}

        {/* Results */}
        {!loading && agencies.length > 0 && (
          <>
            <div className="mb-4 text-foreground/70">
              Found <span className="font-bold text-primary">{agencies.length}</span> {agencies.length === 1 ? 'agency' : 'agencies'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map((agency) => (
                <div key={agency._id} className="bg-white rounded-2xl border border-border shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">{agency.agencyName}</h3>
                      <div className="flex items-center gap-1 text-yellow-500 mt-1">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-semibold">{agency.rating || 4.5}</span>
                      </div>
                    </div>
                    {agency.priceRange && (
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{agency.priceRange}</p>
                        <p className="text-xs text-foreground/60">
                          {agency.vehicleCount} {agency.vehicleCount === 1 ? 'vehicle' : 'vehicles'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {agency.services && agency.services.length > 0 && (
                      <div className="flex items-center gap-2 text-foreground/70 text-sm">
                        <Car size={16} />
                        <span>{agency.services.join(", ")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-foreground/70 text-sm">
                      <Phone size={16} />
                      <span>{agency.phone}</span>
                    </div>
                    {agency.location?.address && (
                      <div className="flex items-center gap-2 text-foreground/70 text-sm">
                        <MapPin size={16} />
                        <span className="line-clamp-1">{agency.location.address}</span>
                      </div>
                    )}
                  </div>

                  {agency.description && (
                    <p className="text-sm text-foreground/60 mb-4 line-clamp-2">{agency.description}</p>
                  )}

                  <button 
                    onClick={() => handleBookNow(agency._id)}
                    className="w-full px-4 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

