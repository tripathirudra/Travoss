const Booking = require("../models/Booking")
const Agency = require("../models/Agency")
const Notification = require("../models/Notification")

// Create new booking (User)
exports.createBooking = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, pickupCoordinates, dropCoordinates, dateTime, vehicleType, passengers, estimatedPrice, distance, agencyId } = req.body

    const booking = new Booking({
      userId: req.user.id,
      agencyId: agencyId || null, // Set specific agency if provided
      pickupLocation,
      dropLocation,
      pickupCoordinates,
      dropCoordinates,
      dateTime,
      vehicleType,
      passengers,
      estimatedPrice,
      distance,
      status: "pending",
    })

    await booking.save()

    // Notify specific agency or all agencies
    if (agencyId) {
      // Notify specific agency
      const notification = new Notification({
        recipientId: agencyId,
        recipientType: "agency",
        type: "ride_request",
        title: "New Ride Request",
        message: `New ride request from ${pickupLocation} to ${dropLocation}`,
        bookingId: booking._id,
      })
      await notification.save()
    } else {
      // Notify all verified agencies
      const agencies = await Agency.find({ isVerified: true })
      
      for (const agency of agencies) {
        const notification = new Notification({
          recipientId: agency._id,
          recipientType: "agency",
          type: "ride_request",
          title: "New Ride Request",
          message: `New ride request from ${pickupLocation} to ${dropLocation}`,
          bookingId: booking._id,
        })
        await notification.save()
      }
    }

    res.status(201).json({ success: true, data: booking })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("agencyId", "agencyName phone rating")
      .populate("vehicleId", "vehicleName vehicleType numberPlate")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: bookings })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get agency ride requests (pending)
exports.getAgencyRideRequests = async (req, res) => {
  try {
    const agencyId = req.user.id

    // Get pending bookings for this specific agency or all pending if no agency assigned
    const bookings = await Booking.find({
      status: "pending",
      $or: [
        { agencyId: agencyId }, // Bookings assigned to this agency
        { agencyId: null }      // Bookings not yet assigned to any agency
      ]
    })
      .populate("userId", "firstName lastName phone")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: bookings })
  } catch (error) {
    console.error("Get ride requests error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get agency accepted rides
exports.getAgencyAcceptedRides = async (req, res) => {
  try {
    const bookings = await Booking.find({
      agencyId: req.user.id,
      status: { $in: ["accepted", "ongoing", "completed"] },
    })
      .populate("userId", "firstName lastName phone")
      .populate("vehicleId", "vehicleName vehicleType numberPlate")
      .populate("driverId", "name phone")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: bookings })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Accept ride request (Agency)
exports.acceptRide = async (req, res) => {
  try {
    const { bookingId, vehicleId, driverId, finalPrice } = req.body

    // Validation
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" })
    }

    if (!vehicleId || !driverId) {
      return res.status(400).json({ message: "Vehicle and driver are required to accept a ride" })
    }

    if (!finalPrice) {
      return res.status(400).json({ message: "Price is required" })
    }

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Booking already processed" })
    }

    booking.agencyId = req.user.id
    booking.vehicleId = vehicleId
    booking.driverId = driverId
    booking.finalPrice = finalPrice
    booking.status = "accepted"
    booking.acceptedAt = new Date()

    await booking.save()

    // Notify user
    const notification = new Notification({
      recipientId: booking.userId,
      recipientType: "user",
      type: "ride_accepted",
      title: "Ride Accepted",
      message: "Your ride request has been accepted!",
      bookingId: booking._id,
    })
    await notification.save()

    res.status(200).json({ success: true, data: booking })
  } catch (error) {
    console.error("Accept ride error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Mark ride as completed (Agency)
exports.completeRide = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, agencyId: req.user.id })

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    booking.status = "completed"
    booking.completedAt = new Date()
    await booking.save()

    // Update agency stats
    const agency = await Agency.findById(req.user.id)
    agency.completedRides += 1
    agency.totalRides += 1
    await agency.save()

    // Notify user
    const notification = new Notification({
      recipientId: booking.userId,
      recipientType: "user",
      type: "ride_completed",
      title: "Ride Completed",
      message: "Your ride has been completed. Please rate your experience!",
      bookingId: booking._id,
    })
    await notification.save()

    res.status(200).json({ success: true, data: booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.id && booking.agencyId?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    booking.status = "cancelled"
    await booking.save()

    // Notify the other party
    const recipientId = booking.userId.toString() === req.user.id ? booking.agencyId : booking.userId
    const recipientType = booking.userId.toString() === req.user.id ? "agency" : "user"

    if (recipientId) {
      const notification = new Notification({
        recipientId,
        recipientType,
        type: "ride_cancelled",
        title: "Ride Cancelled",
        message: "A ride has been cancelled",
        bookingId: booking._id,
      })
      await notification.save()
    }

    res.status(200).json({ success: true, data: booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
