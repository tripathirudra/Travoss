const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/travoss", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/agency-auth", require("./routes/agencyAuth"))
app.use("/api/agencies", require("./routes/agencies"))
app.use("/api/bookings", require("./routes/bookings"))
app.use("/api/vehicles", require("./routes/vehicles"))
app.use("/api/drivers", require("./routes/drivers"))
app.use("/api/notifications", require("./routes/notifications"))
app.use("/api/upload", require("./routes/upload"))

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || "Internal server error" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
