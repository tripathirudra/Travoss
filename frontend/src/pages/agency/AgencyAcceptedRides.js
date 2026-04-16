import { useState, useEffect } from "react"
import { MapPin, Clock, Users, CheckCircle } from "lucide-react"
import api from "../../services/api"

export default function AgencyAcceptedRides() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      const response = await api.get(`/bookings/agency/accepted`)
      setRides(response.data.data)
    } catch (error) {
      console.error("Error fetching rides:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    if (window.confirm("Mark this ride as completed?")) {
      try {
        await api.patch(`/bookings/${id}/complete`, {})
        fetchRides()
      } catch (error) {
        console.error("Error completing ride:", error)
      }
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      accepted: "bg-blue-500/10 text-blue-600",
      ongoing: "bg-yellow-500/10 text-yellow-600",
      completed: "bg-green-500/10 text-green-600",
    }
    return colors[status] || "bg-gray-500/10 text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border shadow-lg p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="border border-border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {ride.userId?.firstName} {ride.userId?.lastName}
                    </h3>
                    <span className={`inline-block px-3 py-1 ${getStatusColor(ride.status)} text-xs font-semibold rounded-lg mt-2 capitalize`}>
                      {ride.status}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-2xl font-bold text-primary">₹{ride.finalPrice}</p>
                    {ride.paymentStatus === "paid" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">
                        PAID
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                        UNPAID
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <MapPin size={16} />
                    <span><strong>From:</strong> {ride.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <MapPin size={16} />
                    <span><strong>To:</strong> {ride.dropLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock size={16} />
                    <span>{new Date(ride.dateTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Users size={16} />
                    <span>{ride.passengers} Passengers</span>
                  </div>
                </div>

                {ride.status !== "completed" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleComplete(ride._id)}
                      className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-foreground/60">
            <p>No accepted rides yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
