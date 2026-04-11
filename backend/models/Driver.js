const mongoose = require("mongoose")

const driverSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  photo: String, // URL to driver photo
  drivingLicense: String, // URL to DL photo
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
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

module.exports = mongoose.model("Driver", driverSchema)

