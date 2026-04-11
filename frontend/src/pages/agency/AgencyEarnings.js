import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, Calendar, Loader, CheckCircle, MapPin, Users } from "lucide-react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export default function AgencyEarnings() {
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/agency-auth/earnings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEarnings(response.data.data)
    } catch (error) {
      console.error("Error fetching earnings:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  const stats = [
    { 
      title: "Total Earnings", 
      value: `₹${earnings?.totalEarnings?.toLocaleString() || 0}`, 
      icon: DollarSign, 
      color: "from-green-500 to-green-600" 
    },
    { 
      title: "This Month", 
      value: `₹${earnings?.thisMonthEarnings?.toLocaleString() || 0}`, 
      icon: Calendar, 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      title: "Growth", 
      value: `${earnings?.growth || 0}%`, 
      icon: TrendingUp, 
      color: "from-purple-500 to-purple-600" 
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-border shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-lg p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Transactions</h3>
        {earnings?.completedBookings && earnings.completedBookings.length > 0 ? (
          <div className="space-y-4">
            {earnings.completedBookings.map((booking) => (
              <div 
                key={booking._id} 
                className="border border-border rounded-xl p-4 hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {booking.userId?.firstName} {booking.userId?.lastName}
                      </h4>
                      <p className="text-sm text-foreground/60">
                        {new Date(booking.completedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{booking.finalPrice}</p>
                    <p className="text-xs text-foreground/60">Completed</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <MapPin size={14} />
                    <span className="truncate">{booking.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <MapPin size={14} />
                    <span className="truncate">{booking.dropLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Users size={14} />
                    <span>{booking.passengers} passengers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Calendar size={14} />
                    <span className="capitalize">{booking.vehicleType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-foreground/60">
            <DollarSign className="mx-auto mb-4 text-foreground/40" size={64} />
            <p className="text-lg font-semibold mb-2">No transactions yet</p>
            <p className="text-sm">Complete rides to see your earnings here</p>
          </div>
        )}
      </div>
    </div>
  )
}

