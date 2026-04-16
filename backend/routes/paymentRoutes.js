const express = require("express")
const {
  initiatePayment,
  verifyPayment,
  getMyPayments,
} = require("../controllers/paymentController")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/initiate", protect, initiatePayment)
router.post("/verify", protect, verifyPayment)
router.get("/my-payments", protect, getMyPayments)

module.exports = router
