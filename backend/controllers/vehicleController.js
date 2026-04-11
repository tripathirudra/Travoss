const Vehicle = require("../models/Vehicle")

// Get all vehicles for an agency
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ agencyId: req.user.id })
    res.status(200).json({ success: true, data: vehicles })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add new vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { vehicleName, numberPlate, vehicleType, seats, hasAC, photos, pricePerKm } = req.body

    const vehicle = new Vehicle({
      agencyId: req.user.id,
      vehicleName,
      numberPlate,
      vehicleType,
      seats,
      hasAC,
      photos: photos || [],
      pricePerKm,
    })

    await vehicle.save()

    res.status(201).json({ success: true, data: vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, agencyId: req.user.id })

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" })
    }

    Object.keys(req.body).forEach((key) => {
      vehicle[key] = req.body[key]
    })

    await vehicle.save()

    res.status(200).json({ success: true, data: vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, agencyId: req.user.id })

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" })
    }

    res.status(200).json({ success: true, message: "Vehicle deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Toggle vehicle availability
exports.toggleAvailability = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, agencyId: req.user.id })

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" })
    }

    vehicle.isAvailable = !vehicle.isAvailable
    await vehicle.save()

    res.status(200).json({ success: true, data: vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

