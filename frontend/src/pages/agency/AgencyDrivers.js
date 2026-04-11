import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Upload, User, Phone, IdCard, Loader } from "lucide-react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export default function AgencyDrivers() {
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    drivingLicensePhoto: "",
    assignedVehicle: "",
    isAvailable: true,
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchDrivers()
    fetchVehicles()
  }, [])

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDrivers(response.data.data || [])
    } catch (error) {
      console.error("Error fetching drivers:", error)
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      console.log("Uploading file:", file.name)

      const response = await axios.post(
        `${API_URL}/upload/single`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log("Upload response:", response.data)

      // Construct full URL for the uploaded file
      const fileUrl = `http://localhost:5000${response.data.url}`
      setFormData((prev) => ({ ...prev, drivingLicensePhoto: fileUrl }))
      alert("License photo uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message)
      alert(`Failed to upload license photo: ${error.response?.data?.message || error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")

      if (editingDriver) {
        // Update driver
        await axios.put(
          `${API_URL}/drivers/${editingDriver._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        // Create driver
        await axios.post(`${API_URL}/drivers`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      setModalOpen(false)
      setEditingDriver(null)
      setFormData({
        name: "",
        phone: "",
        drivingLicensePhoto: "",
        assignedVehicle: "",
        isAvailable: true,
      })
      fetchDrivers()
    } catch (error) {
      console.error("Error saving driver:", error)
      alert(error.response?.data?.message || "Failed to save driver")
    }
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setFormData({
      name: driver.name,
      phone: driver.phone,
      drivingLicensePhoto: driver.drivingLicensePhoto,
      assignedVehicle: driver.assignedVehicle?._id || "",
      isAvailable: driver.isAvailable,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${API_URL}/drivers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchDrivers()
    } catch (error) {
      console.error("Error deleting driver:", error)
      alert("Failed to delete driver")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <button
          onClick={() => {
            setEditingDriver(null)
            setFormData({
              name: "",
              phone: "",
              drivingLicensePhoto: "",
              assignedVehicle: "",
              isAvailable: true,
            })
            setModalOpen(true)
          }}
          className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Driver
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-primary" size={48} />
        </div>
      ) : drivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div key={driver._id} className="bg-white rounded-2xl border border-border shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">{driver.name}</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${driver.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {driver.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Phone size={16} />
                  <span>{driver.phone}</span>
                </div>
                {driver.assignedVehicle && (
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <IdCard size={16} />
                    <span>{driver.assignedVehicle.vehicleName} - {driver.assignedVehicle.numberPlate}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(driver)}
                  className="flex-1 px-4 py-2 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(driver._id)}
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
          <User className="mx-auto mb-4 text-foreground/40" size={64} />
          <p className="text-foreground/60 mb-4">No drivers added yet</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-all"
          >
            Add Your First Driver
          </button>
        </div>
      )}

      {/* Add/Edit Driver Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 overflow-y-auto flex-1">
              <h3 className="text-2xl font-bold mb-6">
                {editingDriver ? "Edit Driver" : "Add New Driver"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter driver name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Driving License Photo *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="license-upload"
                  />
                  <label
                    htmlFor="license-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-background border border-border rounded-lg cursor-pointer hover:border-primary transition-all"
                  >
                    {uploading ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        Uploading...
                      </>
                    ) : formData.drivingLicensePhoto ? (
                      <>
                        <Upload size={18} />
                        License Uploaded ✓
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload License Photo
                      </>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Assign Vehicle</label>
                  <select
                    value={formData.assignedVehicle}
                    onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">No vehicle assigned</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.vehicleName} - {vehicle.numberPlate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium">
                    Driver is available
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!formData.name || !formData.phone || !formData.drivingLicensePhoto || uploading}
                    className="flex-1 px-6 py-2 bg-primary text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50"
                  >
                    {editingDriver ? "Update Driver" : "Add Driver"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false)
                      setEditingDriver(null)
                    }}
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

