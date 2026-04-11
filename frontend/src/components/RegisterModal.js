import { useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"
import { authService } from "../services/authService"

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await authService.register(formData.firstName, formData.lastName, formData.email, formData.phone, formData.password)
      onClose()
      window.location.reload()
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
          <p className="text-sm text-foreground/60">Create your account to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
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

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
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
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
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
            disabled={loading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 mt-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
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
