import { useState, useEffect } from "react"
import { MapPin, Clock, Users, Car, CheckCircle, XCircle } from "lucide-react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export default function AgencyRideRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [acceptModalOpen, setAcceptModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [acceptData, setAcceptData] = useState({
    finalPrice: "",
    vehicleId: "",
    driverId: "",
  })
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])

  useEffect(() => {
    fetchRequests()
    fetchVehicles()
    fetchDrivers()
  }, [])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/bookings/agency/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests(response.data.data)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVehicles(response.data.data || [])
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    }
  }

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDrivers(response.data.data || [])
    } catch (error) {
      console.error("Error fetching drivers:", error)
    }
  }

  const handleAccept = async () => {
    try {
      // Validation
      if (!acceptData.vehicleId || !acceptData.driverId || !acceptData.finalPrice) {
        alert("Please select vehicle, driver and enter price")
        return
      }

      const token = localStorage.getItem("token")
      await axios.post(
        `${API_URL}/bookings/agency/accept`,
        {
          bookingId: selectedRequest._id,
          vehicleId: acceptData.vehicleId,
          driverId: acceptData.driverId,
          finalPrice: parseFloat(acceptData.finalPrice),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setAcceptModalOpen(false)
      setAcceptData({ finalPrice: "", vehicleId: "", driverId: "" })
      fetchRequests()
      alert("Ride request accepted successfully!")
    } catch (error) {
      console.error("Error accepting request:", error)
      alert(error.response?.data?.message || "Error accepting request")
    }
  }

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.patch(`${API_URL}/bookings/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        fetchRequests()
      } catch (error) {
        console.error("Error rejecting request:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border shadow-lg p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="border border-border rounded-xl p-6 hover:border-primary transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {request.userId?.firstName} {request.userId?.lastName}
                    </h3>
                    <p className="text-sm text-foreground/60">Phone: {request.userId?.phone || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{request.estimatedPrice || "TBD"}</p>
                    <p className="text-xs text-foreground/60">Estimated Price</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <MapPin size={16} />
                    <span><strong>Pickup:</strong> {request.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <MapPin size={16} />
                    <span><strong>Drop:</strong> {request.dropLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock size={16} />
                    <span>{new Date(request.dateTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Users size={16} />
                    <span>{request.passengers} Passengers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Car size={16} />
                    <span className="capitalize">{request.vehicleType}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedRequest(request)
                      setAcceptData({ 
                        finalPrice: request.estimatedPrice || 500,
                        vehicleId: "",
                        driverId: "",
                      })
                      setAcceptModalOpen(true)
                    }}
                    className="flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="flex-1 px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-foreground/60">
            <p>No pending ride requests at the moment</p>
          </div>
        )}
      </div>

      {/* Accept Modal */}
      {acceptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 overflow-y-auto flex-1">
              <h3 className="text-2xl font-bold mb-6">Accept Ride Request</h3>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-foreground">Ride Details:</p>
                <p className="text-xs text-foreground/70 mt-1">
                  {selectedRequest?.pickupLocation} → {selectedRequest?.dropLocation}
                </p>
                <p className="text-xs text-foreground/70">
                  Passengers: {selectedRequest?.passengers} | Type: {selectedRequest?.vehicleType}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Vehicle *</label>
                  <select
                    required
                    value={acceptData.vehicleId}
                    onChange={(e) => setAcceptData({ ...acceptData, vehicleId: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Choose a vehicle...</option>
                    {vehicles
                      .filter(v => v.isAvailable)
                      .map((vehicle) => (
                        <option key={vehicle._id} value={vehicle._id}>
                          {vehicle.vehicleName} - {vehicle.numberPlate} ({vehicle.vehicleType})
                        </option>
                      ))}
                  </select>
                  {vehicles.filter(v => v.isAvailable).length === 0 && (
                    <p className="text-xs text-red-600 mt-1">No available vehicles. Please add vehicles first.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Driver *</label>
                  <select
                    required
                    value={acceptData.driverId}
                    onChange={(e) => setAcceptData({ ...acceptData, driverId: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Choose a driver...</option>
                    {drivers
                      .filter(d => d.isAvailable)
                      .map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.name} - {driver.phone}
                        </option>
                      ))}
                  </select>
                  {drivers.filter(d => d.isAvailable).length === 0 && (
                    <p className="text-xs text-red-600 mt-1">No available drivers. Please add drivers first.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Final Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={acceptData.finalPrice}
                    onChange={(e) => setAcceptData({ ...acceptData, finalPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter final price"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAccept}
                  disabled={!acceptData.vehicleId || !acceptData.driverId || !acceptData.finalPrice}
                  className="flex-1 px-6 py-2 bg-primary text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Accept
                </button>
                <button
                  onClick={() => {
                    setAcceptModalOpen(false)
                    setAcceptData({ finalPrice: "", vehicleId: "", driverId: "" })
                  }}
                  className="flex-1 px-6 py-2 border border-border font-medium rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
