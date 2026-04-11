const express = require("express")
const { getAllAgencies, getNearbyAgencies, createAgency, getAgencyById } = require("../controllers/agencyController")

const router = express.Router()

router.get("/", getAllAgencies)
router.get("/nearby", getNearbyAgencies)
router.get("/:id", getAgencyById)
router.post("/", createAgency)

module.exports = router
