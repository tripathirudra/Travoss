const Agency = require("../models/Agency")
const Vehicle = require("../models/Vehicle")

exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().select("-password")
    
    // Get vehicle count and price range for each agency
    const agenciesWithVehicles = await Promise.all(
      agencies.map(async (agency) => {
        const vehicles = await Vehicle.find({ agencyId: agency._id })
        const vehicleCount = vehicles.length
        const minPrice = vehicles.length > 0 ? Math.min(...vehicles.map(v => v.pricePerKm)) : 0
        const maxPrice = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.pricePerKm)) : 0
        
        return {
          ...agency.toObject(),
          vehicleCount,
          priceRange: vehicleCount > 0 ? `₹${minPrice}-${maxPrice}/km` : "N/A"
        }
      })
    )
    
    res.json(agenciesWithVehicles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getNearbyAgencies = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query
    const agencies = await Agency.find({
      "location.latitude": {
        $gte: Number.parseFloat(latitude) - radius / 111,
        $lte: Number.parseFloat(latitude) + radius / 111,
      },
      "location.longitude": {
        $gte: Number.parseFloat(longitude) - radius / 111,
        $lte: Number.parseFloat(longitude) + radius / 111,
      },
    }).select("-password")
    
    // Get vehicle count and price range for each agency
    const agenciesWithVehicles = await Promise.all(
      agencies.map(async (agency) => {
        const vehicles = await Vehicle.find({ agencyId: agency._id })
        const vehicleCount = vehicles.length
        const minPrice = vehicles.length > 0 ? Math.min(...vehicles.map(v => v.pricePerKm)) : 0
        const maxPrice = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.pricePerKm)) : 0
        
        return {
          ...agency.toObject(),
          vehicleCount,
          priceRange: vehicleCount > 0 ? `₹${minPrice}-${maxPrice}/km` : "N/A"
        }
      })
    )
    
    res.json(agenciesWithVehicles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createAgency = async (req, res) => {
  const agency = new Agency(req.body)
  try {
    await agency.save()
    res.status(201).json(agency)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id)
    if (!agency) return res.status(404).json({ message: "Agency not found" })
    res.json(agency)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
