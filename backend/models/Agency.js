const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

const agencySchema = new mongoose.Schema({
  agencyName: {
    type: String,
    required: true,
  },
  ownerName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  drivingLicense: String, // URL to uploaded DL photo
  vehiclePhotos: [String], // Array of vehicle photo URLs
  logo: String,
  address: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
  completedRides: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["agency"],
    default: "agency",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
agencySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcryptjs.hash(this.password, 10)
  next()
})

// Method to compare passwords
agencySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("Agency", agencySchema)
