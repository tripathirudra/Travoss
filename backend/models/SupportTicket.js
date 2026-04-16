const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "agent"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const supportTicketSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    default: "Guest User",
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on new messages
supportTicketSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.SupportTicket || mongoose.model("SupportTicket", supportTicketSchema);
