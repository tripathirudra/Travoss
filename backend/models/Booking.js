const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    default: null,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  pickupCoordinates: {
    latitude: Number,
    longitude: Number,
  },
  dropCoordinates: {
    latitude: Number,
    longitude: Number,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ["sedan", "suv", "hatchback", "van", "traveller", "bus", "any"],
    default: "any",
  },
  passengers: {
    type: Number,
    required: true,
  },
  estimatedPrice: Number,
  finalPrice: Number,
  distance: Number, // in kilometers
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  completedAt: Date,
})

module.exports = mongoose.model("Booking", bookingSchema)
