const express = require("express")
const { getDrivers, addDriver, updateDriver, deleteDriver, toggleAvailability } = require("../controllers/driverController")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.get("/", protect, getDrivers)
router.post("/", protect, addDriver)
router.put("/:id", protect, updateDriver)
router.delete("/:id", protect, deleteDriver)
router.patch("/:id/availability", protect, toggleAvailability)

module.exports = router

