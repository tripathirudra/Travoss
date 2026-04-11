const express = require("express")
const {
  createBooking,
  getUserBookings,
  getAgencyRideRequests,
  getAgencyAcceptedRides,
  acceptRide,
  completeRide,
  cancelBooking,
} = require("../controllers/bookingController")
const { protect } = require("../middleware/auth")

const router = express.Router()

// User routes
router.post("/", protect, createBooking)
router.get("/user", protect, getUserBookings)

// Agency routes
router.get("/agency/requests", protect, getAgencyRideRequests)
router.get("/agency/accepted", protect, getAgencyAcceptedRides)
router.post("/agency/accept", protect, acceptRide)
router.patch("/:id/complete", protect, completeRide)

// Common routes
router.patch("/:id/cancel", protect, cancelBooking)

module.exports = router
