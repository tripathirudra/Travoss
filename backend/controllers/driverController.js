const Driver = require("../models/Driver")

// Get all drivers for an agency
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ agencyId: req.user.id }).populate("assignedVehicle")
    res.status(200).json({ success: true, data: drivers })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add new driver
exports.addDriver = async (req, res) => {
  try {
    const { name, phone, photo, drivingLicense, assignedVehicle } = req.body

    const driver = new Driver({
      agencyId: req.user.id,
      name,
      phone,
      photo,
      drivingLicense,
      assignedVehicle,
    })

    await driver.save()

    res.status(201).json({ success: true, data: driver })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update driver
exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findOne({ _id: req.params.id, agencyId: req.user.id })

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" })
    }

    Object.keys(req.body).forEach((key) => {
      driver[key] = req.body[key]
    })

    await driver.save()

    res.status(200).json({ success: true, data: driver })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete driver
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({ _id: req.params.id, agencyId: req.user.id })

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" })
    }

    res.status(200).json({ success: true, message: "Driver deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Toggle driver availability
exports.toggleAvailability = async (req, res) => {
  try {
    const driver = await Driver.findOne({ _id: req.params.id, agencyId: req.user.id })

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" })
    }

    driver.isAvailable = !driver.isAvailable
    await driver.save()

    res.status(200).json({ success: true, data: driver })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

