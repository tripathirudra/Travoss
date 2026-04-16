const express = require("express");
const router = express.Router();
const SharedRide = require("../models/SharedRide");
const { protect } = require("../middleware/auth");

// @route   POST /api/shared-rides
// @desc    Offer a new shared ride (Carpool)
// @access  Private (Registered Users)
router.post("/", protect, async (req, res) => {
  try {
    const { origin, destination, departureTime, totalSeats, pricePerSeat, type } = req.body;

    if (!origin || !destination || !departureTime || !totalSeats) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newRideData = {
      origin,
      destination,
      departureTime,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat: pricePerSeat || 0,
      type: type || 'offer',
      passengers: [],
    };

    if (type === 'request') {
      newRideData.requesterId = req.user.id || req.user._id;
    } else {
      newRideData.driverId = req.user.id || req.user._id;
    }

    const newRide = new SharedRide(newRideData);
    const savedRide = await newRide.save();
    res.status(201).json(savedRide);
  } catch (error) {
    console.error("Error creating shared ride:", error);
    res.status(500).json({ message: "Failed to create shared ride" });
  }
});

// @route   GET /api/shared-rides/search
// @desc    Find available shared rides
// @access  Public
router.get("/search", async (req, res) => {
  try {
    const { origin, destination, date, type } = req.query;

    let query = { 
      status: "scheduled",
      type: type || "offer"
    };

    if (type === "offer") {
      query.availableSeats = { $gt: 0 };
    }

    if (origin) query.origin = { $regex: origin, $options: "i" };
    if (destination) query.destination = { $regex: destination, $options: "i" };

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(searchDate.getDate() + 1);
      query.departureTime = {
        $gte: searchDate,
        $lt: nextDay
      };
    } else {
        query.departureTime = { $gte: new Date() };
    }

    const rides = await SharedRide.find(query)
      .populate("driverId", "firstName lastName profileImage rating")
      .populate("requesterId", "firstName lastName profileImage rating")
      .sort({ departureTime: 1 });

    res.json(rides);
  } catch (error) {
    console.error("Error searching rides:", error);
    res.status(500).json({ message: "Server Error: Could not fetch rides" });
  }
});

// @route   POST /api/shared-rides/:id/request
// @desc    Request to join an available shared ride
// @access  Private (Registered Users)
router.post("/:id/request", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const rideId = req.params.id;

    const ride = await SharedRide.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driverId.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot join your own ride" });
    }

    if (ride.status !== "scheduled") {
      return res.status(400).json({ message: "This ride is no longer available" });
    }

    if (ride.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available on this ride" });
    }

    const existingRequest = ride.requests.find(r => r.userId.toString() === userId.toString());
    if (existingRequest) {
      return res.status(400).json({ message: "You have already sent a request for this ride" });
    }

    // Add request
    ride.requests.push({ userId, status: "pending" });
    const updatedRide = await ride.save();

    res.json({ message: "Request sent successfully", ride: updatedRide });
  } catch (error) {
    console.error("Error requesting ride:", error);
    res.status(500).json({ message: "Server Error: Could not send request" });
  }
});

// @route   GET /api/shared-rides/manage/my-rides
// @desc    Get rides offered by the user with their requests
// @access  Private
router.get("/manage/my-rides", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const rides = await SharedRide.find({ 
      $or: [
        { driverId: userId },
        { requesterId: userId }
      ]
    })
      .populate("requests.userId", "firstName lastName profileImage phone")
      .populate("passengers", "firstName lastName profileImage phone")
      .populate("requesterId", "firstName lastName profileImage phone")
      .sort({ departureTime: -1 });
    res.json(rides);
  } catch (error) {
    console.error("Error fetching managed rides:", error);
    res.status(500).json({ message: "Server Error: Could not fetch rides" });
  }
});

// @route   GET /api/shared-rides/my-bookings
// @desc    Get rides joined or requested by the user
// @access  Private
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const rides = await SharedRide.find({
      $or: [
        { passengers: userId },
        { "requests.userId": userId }
      ]
    })
      .populate("driverId", "firstName lastName profileImage phone")
      .sort({ departureTime: -1 });
    res.json(rides);
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    res.status(500).json({ message: "Server Error: Could not fetch bookings" });
  }
});

// @route   PATCH /api/shared-rides/:rideId/requests/:passengerId
// @desc    Accept or Reject a ride request
// @access  Private (Driver Only)
router.patch("/:rideId/requests/:passengerId", protect, async (req, res) => {
  try {
    const driverId = req.user.id || req.user._id;
    const { rideId, passengerId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const ride = await SharedRide.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driverId.toString() !== driverId.toString()) {
      return res.status(403).json({ message: "Unauthorized. Only the driver can manage requests." });
    }

    const requestIndex = ride.requests.findIndex(r => r.userId.toString() === passengerId);
    if (requestIndex === -1) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (ride.requests[requestIndex].status !== "pending") {
      return res.status(400).json({ message: `Request is already ${ride.requests[requestIndex].status}` });
    }

    ride.requests[requestIndex].status = status;

    if (status === "accepted") {
      if (ride.availableSeats <= 0) {
        return res.status(400).json({ message: "No seats available to accept this request" });
      }
      ride.availableSeats -= 1;
      ride.passengers.push(passengerId);
    }

    await ride.save();
    res.json({ message: `Request ${status} successfully`, ride });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Server Error: Could not update request" });
  }
});

module.exports = router;
