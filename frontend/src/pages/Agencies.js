import { useState, useEffect, useRef } from "react"
import { MapPin, Star, Search, Phone, Mail, Navigation, Filter } from "lucide-react"
import { agencyService } from "../services/api"
import ReactMapGL, { Marker, NavigationControl, GeolocateControl, Popup } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"

// Replace with your actual Mapbox token from https://account.mapbox.com/
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_API_KEY || ""

export default function Agencies() {
  const [agencies, setAgencies] = useState([])
  const [filteredAgencies, setFilteredAgencies] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState("grid") // "grid" or "map"
  const [selectedAgency, setSelectedAgency] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [sortBy, setSortBy] = useState("name") // "name", "rating", "distance"
  
  const [viewport, setViewport] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4,
  })

  const mapRef = useRef()

  useEffect(() => {
    fetchAgencies()
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          setUserLocation(location)
          setViewport({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 10,
          })
        },
        (err) => {
          console.error("Error getting location:", err)
        }
      )
    }
  }

  const fetchAgencies = async () => {
    try {
      setLoading(true)
      const response = await agencyService.getAll()
      const agenciesData = response.data.map((agency) => ({
        ...agency,
        // Mock coordinates if not present
        location: agency.location || {
          address: "India",
          coordinates: {
            latitude: 20.5937 + (Math.random() - 0.5) * 20,
            longitude: 78.9629 + (Math.random() - 0.5) * 20,
          },
        },
      }))
      setAgencies(agenciesData)
      setFilteredAgencies(agenciesData)
    } catch (err) {
      setError("Failed to fetch agencies")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    let filtered = agencies.filter(
      (agency) =>
        agency.name.toLowerCase().includes(value.toLowerCase()) ||
        agency.location?.address?.toLowerCase().includes(value.toLowerCase())
    )
    
    // Apply sorting
    filtered = sortAgencies(filtered, sortBy)
    setFilteredAgencies(filtered)
  }

  const sortAgencies = (agenciesList, sortType) => {
    let sorted = [...agenciesList]
    
    switch (sortType) {
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "distance":
        if (userLocation) {
          sorted = sorted.filter(a => a.location?.coordinates).sort((a, b) => {
            const distA = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              a.location.coordinates.latitude,
              a.location.coordinates.longitude
            )
            const distB = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              b.location.coordinates.latitude,
              b.location.coordinates.longitude
            )
            return distA - distB
          })
        }
        break
      default: // name
        sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return sorted
  }

  const handleSortChange = (sortType) => {
    setSortBy(sortType)
    const sorted = sortAgencies(filteredAgencies, sortType)
    setFilteredAgencies(sorted)
  }

  const handleLocationSearch = async () => {
    // Switch to map view first
    setViewMode("map")
    
    if (!userLocation) {
      // Get user location and wait for it
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
            setUserLocation(location)
            
            // Zoom to user location
            setViewport({
              latitude: location.latitude,
              longitude: location.longitude,
              zoom: 12,
            })
            
            // Try to fetch nearby agencies
            try {
              const response = await agencyService.getNearby(location.latitude, location.longitude)
              setFilteredAgencies(response.data)
            } catch (err) {
              // If API fails, just filter by distance from all agencies
              const sorted = sortAgencies(agencies, "distance")
              setFilteredAgencies(sorted.slice(0, 10)) // Show top 10 nearest
              setSortBy("distance")
            }
          },
          (err) => {
            setError("Unable to access your location. Please enable location services.")
            setTimeout(() => setError(""), 5000)
          }
        )
      }
      return
    }

    // User location already available
    setViewport({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      zoom: 12,
    })

    try {
      const response = await agencyService.getNearby(userLocation.latitude, userLocation.longitude)
      setFilteredAgencies(response.data)
    } catch (err) {
      // If API fails, just filter by distance from all agencies
      const sorted = sortAgencies(agencies, "distance")
      setFilteredAgencies(sorted.slice(0, 10)) // Show top 10 nearest
      setSortBy("distance")
    }
  }

  const handleMarkerClick = (agency) => {
    setSelectedAgency(agency)
    setViewport({
      ...viewport,
      latitude: agency.location.coordinates.latitude,
      longitude: agency.location.coordinates.longitude,
      zoom: 14,
    })
  }

  return (
    <main className="pt-20 pb-20 bg-gradient-to-b from-blue-50/30 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 pt-20">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Find Your Perfect <span className="gradient-primary bg-clip-text text-transparent">Travel Agency</span>
          </h1>
          <p className="text-xl text-foreground/70">Discover verified agencies near you with interactive map</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3 flex-col lg:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input
                type="text"
                placeholder="Search agencies by name or location..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-white text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              />
            </div>
            <button
              onClick={handleLocationSearch}
              className="px-6 py-4 border-2 border-primary text-primary bg-white font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Navigation size={20} />
              <span>Nearest Agencies</span>
            </button>
          </div>

          {/* View Mode and Sort Options */}
          <div className="flex flex-wrap items-center gap-3 justify-between bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-foreground/60" />
              <span className="text-sm font-medium text-foreground/70">Sort by:</span>
              <div className="flex gap-2">
                {["name", "rating", "distance"].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => handleSortChange(sort)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      sortBy === sort
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
                    }`}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewMode === "map"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
                }`}
              >
                Map View
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-foreground/70 mt-4">Loading agencies...</p>
          </div>
        ) : (
          <>
            {viewMode === "map" ? (
              <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-lg mb-8">
                <div style={{ height: "600px", width: "100%" }}>
                  {MAPBOX_TOKEN && MAPBOX_TOKEN !== "MAPBOX_API_KEY" ? (
                    <ReactMapGL
                      ref={mapRef}
                      {...viewport}
                      onMove={(evt) => setViewport(evt.viewState)}
                      mapStyle="mapbox://styles/mapbox/streets-v12"
                      mapboxAccessToken={MAPBOX_TOKEN}
                    >
                      <NavigationControl position="top-right" />
                      <GeolocateControl
                        position="top-right"
                        trackUserLocation
                        onGeolocate={(e) => {
                          setUserLocation({
                            latitude: e.coords.latitude,
                            longitude: e.coords.longitude,
                          })
                        }}
                      />

                      {/* User Location Marker */}
                      {userLocation && (
                        <Marker
                          latitude={userLocation.latitude}
                          longitude={userLocation.longitude}
                          anchor="bottom"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </Marker>
                      )}

                      {/* Agency Markers */}
                      {filteredAgencies.map((agency) => {
                        if (!agency.location?.coordinates) return null
                        return (
                          <Marker
                            key={agency._id}
                            latitude={agency.location.coordinates.latitude}
                            longitude={agency.location.coordinates.longitude}
                            anchor="bottom"
                          >
                            <button
                              onClick={() => handleMarkerClick(agency)}
                              className="transform hover:scale-110 transition-transform"
                            >
                              <MapPin className="text-primary fill-primary" size={36} />
                            </button>
                          </Marker>
                        )
                      })}

                      {/* Popup for selected agency */}
                      {selectedAgency && selectedAgency.location?.coordinates && (
                        <Popup
                          latitude={selectedAgency.location.coordinates.latitude}
                          longitude={selectedAgency.location.coordinates.longitude}
                          onClose={() => setSelectedAgency(null)}
                          closeButton={true}
                          closeOnClick={false}
                          offsetTop={-10}
                        >
                          <div className="p-2">
                            <h3 className="font-bold text-foreground mb-1">{selectedAgency.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={
                                    i < Math.round(selectedAgency.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                              <span className="text-xs text-foreground/70 ml-1">
                                ({selectedAgency.rating || "N/A"})
                              </span>
                            </div>
                            <p className="text-xs text-foreground/70 mb-2">
                              {selectedAgency.location?.address || "Location not specified"}
                            </p>
                            <button className="w-full px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                              View Details
                            </button>
                          </div>
                        </Popup>
                      )}
                    </ReactMapGL>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">🗺️</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Map View Unavailable</h3>
                        <p className="text-foreground/70 mb-4">
                          Please add your Mapbox API key to enable interactive maps.
                        </p>
                        <p className="text-sm text-foreground/60">
                          Get your free API key at{" "}
                          <a
                            href="https://account.mapbox.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            mapbox.com
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgencies.map((agency) => {
                let distance = null
                if (userLocation && agency.location?.coordinates) {
                  distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    agency.location.coordinates.latitude,
                    agency.location.coordinates.longitude
                  )
                }

                return (
                  <div
                    key={agency._id}
                    className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50 group-hover:scale-110 transition-transform">
                        🏢
                      </div>
                      {distance && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-primary">
                          📍 {distance.toFixed(1)} km
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {agency.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.round(agency.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="text-sm font-semibold text-foreground/80">
                          ({agency.rating || "N/A"})
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-sm text-foreground/70">
                          <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <p>{agency.location?.address || "Location not specified"}</p>
                        </div>
                        {agency.phone && (
                          <div className="flex items-center gap-2 text-sm text-foreground/70">
                            <Phone size={16} className="text-primary flex-shrink-0" />
                            <p>{agency.phone}</p>
                          </div>
                        )}
                        {agency.email && (
                          <div className="flex items-center gap-2 text-sm text-foreground/70">
                            <Mail size={16} className="text-primary flex-shrink-0" />
                            <p>{agency.email}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                        {agency.description || "Professional travel services for all your journey needs."}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedAgency(agency)
                            setViewMode("map")
                            if (agency.location?.coordinates) {
                              setViewport({
                                latitude: agency.location.coordinates.latitude,
                                longitude: agency.location.coordinates.longitude,
                                zoom: 14,
                              })
                            }
                          }}
                          className="flex-1 px-4 py-2.5 border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary/5 transition-all"
                        >
                          View on Map
                        </button>
                        <button className="flex-1 px-4 py-2.5 gradient-primary text-white font-medium rounded-xl hover:shadow-lg transition-all">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {!loading && filteredAgencies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-foreground/70 mb-2">No agencies found</p>
            <p className="text-foreground/60">Try adjusting your search criteria</p>
          </div>
        )}
      </section>
    </main>
  )
}
