const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  recipientType: {
    type: String,
    enum: ["user", "agency"],
    required: true,
  },
  type: {
    type: String,
    enum: ["ride_request", "ride_accepted", "ride_cancelled", "ride_completed", "payment_received", "rating_received"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Notification", notificationSchema)

