const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
  sharedRideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SharedRide",
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  method: {
    type: String,
    enum: ["upi", "card", "netbanking"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending",
  },
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  paymentDetails: {
    upiId: String,
    cardLast4: String,
    bankName: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Payment", paymentSchema)
