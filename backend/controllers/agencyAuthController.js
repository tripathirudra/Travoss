const Agency = require("../models/Agency")
const jwt = require("jsonwebtoken")

const generateToken = (id) => {
  return jwt.sign({ id, type: "agency" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

exports.register = async (req, res) => {
  try {
    const { agencyName, ownerName, email, phone, password, drivingLicense, vehiclePhotos, location } = req.body

    // Validation
    if (!agencyName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Check if agency exists
    let agency = await Agency.findOne({ email })
    if (agency) {
      return res.status(400).json({ message: "Agency already exists with that email" })
    }

    // Create agency
    agency = new Agency({
      agencyName,
      ownerName,
      email,
      phone,
      password,
      drivingLicense,
      vehiclePhotos: vehiclePhotos || [],
      location: location || {},
    })

    await agency.save()

    const token = generateToken(agency._id)

    res.status(201).json({
      token,
      agency: {
        id: agency._id,
        agencyName: agency.agencyName,
        ownerName: agency.ownerName,
        email: agency.email,
        phone: agency.phone,
        location: agency.location,
        role: agency.role,
        userType: "agency",
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    // Check for agency
    const agency = await Agency.findOne({ email })

    if (!agency) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if password matches
    const isMatch = await agency.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(agency._id)

    res.status(200).json({
      token,
      agency: {
        id: agency._id,
        agencyName: agency.agencyName,
        ownerName: agency.ownerName,
        email: agency.email,
        phone: agency.phone,
        location: agency.location,
        role: agency.role,
        userType: "agency",
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const agency = await Agency.findById(userId).select("-password")

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" })
    }

    res.status(200).json({
      success: true,
      data: agency,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const { agencyName, ownerName, phone, location } = req.body

    const agency = await Agency.findById(userId)

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" })
    }

    if (agencyName) agency.agencyName = agencyName
    if (ownerName) agency.ownerName = ownerName
    if (phone) agency.phone = phone
    if (location) agency.location = location

    await agency.save()

    // Return updated agency without password
    const updatedAgency = await Agency.findById(userId).select("-password")

    res.status(200).json({
      success: true,
      data: updatedAgency,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: error.message })
  }
}

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const agency = await Agency.findById(userId)
    
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" })
    }

    const Vehicle = require("../models/Vehicle")
    const Booking = require("../models/Booking")

    const totalVehicles = await Vehicle.countDocuments({ agencyId: userId })
    const pendingRequests = await Booking.countDocuments({ agencyId: userId, status: "pending" })

    res.status(200).json({
      success: true,
      data: {
        totalBookings: agency.totalRides || 0,
        completedRides: agency.completedRides || 0,
        pendingRequests,
        vehiclesListed: totalVehicles,
        rating: agency.rating || 4.5,
      },
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: error.message })
  }
}

exports.getEarnings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const Booking = require("../models/Booking")

    // Get all completed bookings for this agency
    const completedBookings = await Booking.find({
      agencyId: userId,
      status: "completed",
    }).populate("userId", "firstName lastName").sort({ completedAt: -1 })

    // Calculate total earnings
    const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.finalPrice || 0), 0)

    // Calculate this month's earnings
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthEarnings = completedBookings
      .filter(booking => new Date(booking.completedAt) >= firstDayOfMonth)
      .reduce((sum, booking) => sum + (booking.finalPrice || 0), 0)

    // Calculate last month's earnings for growth
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEarnings = completedBookings
      .filter(booking => {
        const completedDate = new Date(booking.completedAt)
        return completedDate >= firstDayOfLastMonth && completedDate < firstDayOfMonth
      })
      .reduce((sum, booking) => sum + (booking.finalPrice || 0), 0)

    // Calculate growth percentage
    const growth = lastMonthEarnings > 0 
      ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1)
      : 0

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        thisMonthEarnings,
        growth,
        completedBookings: completedBookings.slice(0, 10), // Return last 10 transactions
      },
    })
  } catch (error) {
    console.error("Get earnings error:", error)
    res.status(500).json({ message: error.message })
  }
}

