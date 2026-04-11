import { useState, useEffect } from "react"
import { Mail, Phone, Edit2, Lock, LogOut, Camera } from "lucide-react"
import useAuth from "../hooks/useAuth"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export default function UserProfile() {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${API_URL}/auth/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      
      // Update local storage
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      setEditing(false)
      alert("Profile updated successfully!")
      window.location.reload()
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-border shadow-lg p-8 mb-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity border-4 border-white">
                <Camera size={20} />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-foreground mt-4">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-foreground/60">User ID: {user?.id?.slice(-8)}</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">First Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground">
                    {user?.firstName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground">
                    {user?.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Mail className="inline mr-2" size={16} />
                Email Address
              </label>
              <div className="px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground">
                {user?.email}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Phone className="inline mr-2" size={16} />
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              ) : (
                <div className="px-4 py-3 border border-border rounded-xl bg-background/50 text-foreground">
                  {user?.phone || "Not provided"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="flex-1 px-6 py-3 border border-border text-foreground font-medium rounded-xl hover:bg-foreground/5 transition-all"
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

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-6 py-4 bg-white border border-border rounded-xl text-foreground font-medium hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
            <Lock size={20} />
            Change Password
          </button>
          
          <button
            onClick={logout}
            className="px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </main>
  )
}
