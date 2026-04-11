const mongoose = require("mongoose")

const vehicleSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
  numberPlate: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ["sedan", "suv", "hatchback", "van", "traveller", "bus"],
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  hasAC: {
    type: Boolean,
    default: true,
  },
  photos: [String], // Array of vehicle photo URLs
  pricePerKm: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Vehicle", vehicleSchema)

