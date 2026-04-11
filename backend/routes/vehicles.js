const express = require("express")
const { getVehicles, addVehicle, updateVehicle, deleteVehicle, toggleAvailability } = require("../controllers/vehicleController")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.get("/", protect, getVehicles)
router.post("/", protect, addVehicle)
router.put("/:id", protect, updateVehicle)
router.delete("/:id", protect, deleteVehicle)
router.patch("/:id/availability", protect, toggleAvailability)

module.exports = router

