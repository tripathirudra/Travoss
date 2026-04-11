const User = require("../models/User")
const jwt = require("jsonwebtoken")

const generateToken = (id) => {
  return jwt.sign({ id, type: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists with that email" })
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
    })

    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    // Check for user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" })
}

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName

    await user.save()

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
