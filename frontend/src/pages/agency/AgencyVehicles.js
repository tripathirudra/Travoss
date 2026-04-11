import { useState, useEffect } from "react"
import { Plus, Trash2, Car as CarIcon } from "lucide-react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export default function AgencyVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    vehicleName: "",
    numberPlate: "",
    vehicleType: "sedan",
    seats: 4,
    hasAC: true,
    pricePerKm: 10,
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVehicles(response.data.data)
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      await axios.post(`${API_URL}/vehicles`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setShowAddModal(false)
      setFormData({
        vehicleName: "",
        numberPlate: "",
        vehicleType: "sedan",
        seats: 4,
        hasAC: true,
        pricePerKm: 10,
      })
      fetchVehicles()
    } catch (error) {
      console.error("Error adding vehicle:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${API_URL}/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        fetchVehicles()
      } catch (error) {
        console.error("Error deleting vehicle:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-2xl border border-border shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{vehicle.vehicleName}</h3>
                  <p className="text-sm text-foreground/60">{vehicle.numberPlate}</p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  vehicle.isAvailable ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                }`}>
                  {vehicle.isAvailable ? "Available" : "Unavailable"}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Type:</span>
                  <span className="font-medium capitalize">{vehicle.vehicleType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Seats:</span>
                  <span className="font-medium">{vehicle.seats}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">AC:</span>
                  <span className="font-medium">{vehicle.hasAC ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Price:</span>
                  <span className="font-medium">₹{vehicle.pricePerKm}/km</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="flex-1 px-4 py-2 bg-red-500/10 text-red-600 font-medium rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-lg p-12 text-center">
          <CarIcon size={48} className="mx-auto mb-4 text-foreground/30" />
          <p className="text-foreground/60 mb-4">No vehicles added yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-all"
          >
            Add Your First Vehicle
          </button>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 overflow-y-auto flex-1">
              <h3 className="text-2xl font-bold mb-6">Add New Vehicle</h3>
              <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Name *</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleName}
                  onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                  placeholder="e.g., Swift Dzire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number Plate *</label>
                <input
                  type="text"
                  required
                  value={formData.numberPlate}
                  onChange={(e) => setFormData({ ...formData, numberPlate: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                  placeholder="e.g., UP00XX0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Type *</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="van">Van</option>
                  <option value="traveller">Traveller</option>
                  <option value="bus">Bus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seats *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price per KM (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.pricePerKm}
                  onChange={(e) => setFormData({ ...formData, pricePerKm: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasAC"
                  checked={formData.hasAC}
                  onChange={(e) => setFormData({ ...formData, hasAC: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="hasAC" className="text-sm font-medium">Has AC</label>
              </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-primary text-white font-medium rounded-xl hover:opacity-90"
                  >
                    Add Vehicle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-2 border border-border font-medium rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

