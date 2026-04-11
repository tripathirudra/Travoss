const express = require("express")
const upload = require("../middleware/upload")

const router = express.Router()

// Single file upload
router.post("/single", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err)
      return res.status(400).json({ 
        message: err.message || "File upload failed",
        error: err.toString()
      })
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
      }

      console.log("File uploaded successfully:", req.file.filename)
      const fileUrl = `/uploads/${req.file.filename}`
      res.status(200).json({ success: true, url: fileUrl })
    } catch (error) {
      console.error("Error processing upload:", error)
      res.status(500).json({ message: error.message })
    }
  })
})

// Multiple files upload
router.post("/multiple", (req, res) => {
  upload.array("files", 5)(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err)
      return res.status(400).json({ 
        message: err.message || "File upload failed",
        error: err.toString()
      })
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" })
      }

      console.log(`${req.files.length} files uploaded successfully`)
      const fileUrls = req.files.map((file) => `/uploads/${file.filename}`)
      res.status(200).json({ success: true, urls: fileUrls })
    } catch (error) {
      console.error("Error processing uploads:", error)
      res.status(500).json({ message: error.message })
    }
  })
})

module.exports = router

