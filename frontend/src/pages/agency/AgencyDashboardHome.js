import { useState, useEffect } from "react"
import { FileText, CheckSquare, Car, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export default function AgencyDashboardHome() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedRides: 0,
    pendingRequests: 0,
    vehiclesListed: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/agency-auth/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(response.data.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    { title: "Total Bookings", value: stats.totalBookings, icon: FileText, color: "from-blue-500 to-blue-600" },
    { title: "Completed Rides", value: stats.completedRides, icon: CheckSquare, color: "from-green-500 to-green-600" },
    { title: "Pending Requests", value: stats.pendingRequests, icon: TrendingUp, color: "from-yellow-500 to-amber-600" },
    { title: "Vehicles Listed", value: stats.vehiclesListed, icon: Car, color: "from-purple-500 to-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-border shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? (
                    <div className="animate-pulse h-8 w-12 bg-gray-200 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-border shadow-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/agency/dashboard/ride-requests"
            className="px-6 py-4 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-all text-center"
          >
            View Booking Requests
          </Link>
          <Link
            to="/agency/dashboard/vehicles"
            className="px-6 py-4 bg-green-500 text-white font-medium rounded-xl hover:opacity-90 transition-all text-center"
          >
            Manage Vehicles
          </Link>
          <Link
            to="/agency/dashboard/earnings"
            className="px-6 py-4 bg-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-all text-center"
          >
            View Earnings
          </Link>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Travoss Agency Dashboard</h2>
        <p className="text-white/90">Manage your rides, vehicles, drivers, and earnings all in one place.</p>
      </div>
    </div>
  )
}
