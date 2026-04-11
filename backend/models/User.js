const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: String,
  password: {
    type: String,
    required: true,
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcryptjs.hash(this.password, 10)
  next()
})

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
