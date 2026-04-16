const Payment = require("../models/Payment")
const Booking = require("../models/Booking")
const SharedRide = require("../models/SharedRide")
const crypto = require("crypto")

// Initiate a payment
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, sharedRideId, amount, method, paymentDetails } = req.body

    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" })
    }

    // Generate a mock transaction ID
    const transactionId = "TXN_" + crypto.randomBytes(8).toString("hex").toUpperCase()

    const payment = new Payment({
      userId: req.user.id,
      bookingId: bookingId || null,
      sharedRideId: sharedRideId || null,
      amount,
      method,
      transactionId,
      paymentDetails,
      status: "pending",
    })

    await payment.save()

    res.status(201).json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId,
        amount,
        status: "pending"
      }
    })
  } catch (error) {
    console.error("Initiate payment error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Verify payment (Mock Verification)
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body

    if (!paymentId || !status) {
      return res.status(400).json({ message: "Payment ID and status are required" })
    }

    const payment = await Payment.findById(paymentId)

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }

    // In a real scenario, we would verify the transaction with a gateway here
    payment.status = status
    payment.updatedAt = new Date()
    await payment.save()

    // Update the corresponding booking or shared ride
    if (status === "success") {
      if (payment.bookingId) {
        await Booking.findByIdAndUpdate(payment.bookingId, {
          paymentStatus: "paid",
          paymentId: payment._id
        })
      } else if (payment.sharedRideId) {
        await SharedRide.findByIdAndUpdate(payment.sharedRideId, {
          paymentStatus: "paid",
          paymentId: payment._id
        })
      }
    }

    res.status(200).json({
      success: true,
      message: `Payment ${status}`,
      data: payment
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get user payment history
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("bookingId")
      .populate("sharedRideId")

    res.status(200).json({ success: true, data: payments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
