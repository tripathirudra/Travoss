import { useState, useEffect } from "react"
import { Edit2, Mail, Phone, MapPin, Loader, Navigation } from "lucide-react"
import { agencyAuthService } from "../../services/agencyAuthService"
import axios from "axios"

export default function AgencyProfile() {
  const agency = agencyAuthService.getCurrentUser()
  const [editing, setEditing] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    agencyName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
  })

  useEffect(() => {
    if (agency) {
      setFormData({
        agencyName: agency.agencyName || "",
        ownerName: agency.ownerName || "",
        email: agency.email || "",
        phone: agency.phone || "",
        location: agency.location || {
          latitude: null,
          longitude: null,
          address: "",
        },
      })
    }
  }, [agency])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "address") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
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
            
            setFormData((prev) => ({
              ...prev,
              location: {
                latitude,
                longitude,
                address,
              },
            }))
          } catch (err) {
            console.error("Reverse geocoding failed:", err)
            setFormData((prev) => ({
              ...prev,
              location: {
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              },
            }))
          } finally {
            setGettingLocation(false)
          }
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.")
          console.error(error)
          setGettingLocation(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setGettingLocation(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Updating profile with data:", formData)
      const result = await agencyAuthService.updateProfile(formData)
      console.log("Update result:", result)
      
      setSuccess("Profile updated successfully!")
      setEditing(false)
      
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error("Update error:", err)
      setError(err.response?.data?.message || err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-border shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
            {agency?.agencyName?.charAt(0)}
          </div>
          <h3 className="text-2xl font-bold text-foreground">{agency?.agencyName}</h3>
          <p className="text-sm text-foreground/60">Agency ID: {agency?.id?.slice(-8)}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Agency Name</label>
            <input
              type="text"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <Mail className="inline mr-2" size={16} />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <Phone className="inline mr-2" size={16} />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <MapPin className="inline mr-2" size={16} />
              Agency Location
            </label>
            {editing && (
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-2 bg-primary/10 border border-primary text-primary rounded-xl hover:bg-primary/20 transition-all disabled:opacity-50"
              >
                {gettingLocation ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation size={18} />
                    Update Current Location
                  </>
                )}
              </button>
            )}
            <textarea
              name="address"
              value={formData.location.address}
              onChange={handleChange}
              disabled={!editing}
              rows="3"
              placeholder="Enter your agency address or use GPS"
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-60"
            />
            {formData.location.latitude && formData.location.longitude && (
              <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                ✓ GPS Coordinates: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setError("")
                }}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-border text-foreground font-medium rounded-xl hover:bg-foreground/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

