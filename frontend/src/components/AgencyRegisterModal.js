import { useState } from "react"
import { Eye, EyeOff, X, Upload, MapPin, Loader } from "lucide-react"
import { agencyAuthService } from "../services/agencyAuthService"
import axios from "axios"
import { API_URL } from "../services/api"

export default function AgencyRegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    agencyName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    drivingLicense: "",
    vehiclePhotos: [],
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  if (!isOpen) return null

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
          
          // Reverse geocoding to get address from coordinates
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
          setError("Unable to get your location. Please enable location services or enter manually.")
          console.error(error)
          setGettingLocation(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setGettingLocation(false)
    }
  }

  const handleFileUpload = async (e, type) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      if (type === "dl") {
        const formData = new FormData()
        formData.append("file", files[0])
        
        const response = await axios.post(`${API_URL}/upload/single`, formData)
        setFormData((prev) => ({ ...prev, drivingLicense: response.data.url }))
      } else if (type === "vehicles") {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i])
        }
        
        const response = await axios.post(`${API_URL}/upload/multiple`, formData)
        setFormData((prev) => ({ ...prev, vehiclePhotos: response.data.urls }))
      }
    } catch (err) {
      setError("File upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      setError("Please add your agency location using GPS or enter manually")
      return
    }

    setLoading(true)

    try {
      await agencyAuthService.register(
        formData.agencyName,
        formData.ownerName,
        formData.email,
        formData.phone,
        formData.password,
        formData.drivingLicense,
        formData.vehiclePhotos,
        formData.location
      )
      onClose()
      window.location.href = "/agency/dashboard"
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-200" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-hidden flex flex-col bg-background border border-border rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
        <div className="p-8 overflow-y-auto flex-1">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-foreground/60 hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Register Agency</h2>
          <p className="text-sm text-foreground/60">Create your agency account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agency Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Agency Name *</label>
            <input
              type="text"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              placeholder="Your agency name"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Owner's full name"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="agency@example.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <MapPin className="inline mr-2" size={16} />
              Agency Location *
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 border border-primary text-primary rounded-lg hover:bg-primary/20 transition-all disabled:opacity-50"
              >
                {gettingLocation ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin size={18} />
                    Use Current Location
                  </>
                )}
              </button>
              <input
                type="text"
                name="address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Or enter address manually"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              {formData.location.latitude && formData.location.longitude && (
                <div className="text-xs text-foreground/60 bg-green-50 p-2 rounded border border-green-200">
                  ✓ Location captured: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                </div>
              )}
            </div>
          </div>

          {/* Driving License Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Driving License Photo</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "dl")}
                className="hidden"
                id="dl-upload"
              />
              <label
                htmlFor="dl-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground cursor-pointer hover:border-primary transition-all"
              >
                <Upload size={18} />
                {formData.drivingLicense ? "DL Uploaded ✓" : "Upload DL Photo"}
              </label>
            </div>
          </div>

          {/* Vehicle Photos Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Vehicle Photos (Multiple)</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, "vehicles")}
                className="hidden"
                id="vehicles-upload"
              />
              <label
                htmlFor="vehicles-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground cursor-pointer hover:border-primary transition-all"
              >
                <Upload size={18} />
                {formData.vehiclePhotos.length > 0 ? `${formData.vehiclePhotos.length} Photos Uploaded ✓` : "Upload Vehicle Photos"}
              </label>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 mt-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : uploading ? "Uploading files..." : "Register Agency"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-foreground/60">Already have an account?</span>
          <div className="flex-1 h-px bg-border" />
        </div>

          {/* Login Link */}
          <button
            onClick={onSwitchToLogin}
            className="w-full px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-primary/5 hover:border-primary transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

