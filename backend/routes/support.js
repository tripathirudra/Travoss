const express = require("express");
const router = express.Router();
const SupportTicket = require("../models/SupportTicket");

// @route   POST /api/support/tickets
// @desc    Create a new support ticket (Chat session)
// @access  Public (for chatbot)
router.post("/tickets", async (req, res) => {
  try {
    const { customerName, initialMessage } = req.body;
    
    const newTicket = new SupportTicket({
      customerName: customerName || "Guest User",
      messages: initialMessage ? [
        { sender: "user", text: initialMessage }
      ] : []
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server Error: Could not create ticket" });
  }
});

// @route   GET /api/support/tickets
// @desc    Get all active support tickets
// @access  Public / Admin (for Support Dashboard)
router.get("/tickets", async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ status: "open" }).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server Error: Could not fetch tickets" });
  }
});

// @route   GET /api/support/tickets/:id
// @desc    Get a specific support ticket by ID
// @access  Public (for Chatbot polling / Desktop view)
router.get("/tickets/:id", async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server Error: Could not fetch ticket" });
  }
});

// @route   POST /api/support/tickets/:id/message
// @desc    Add a message to an existing ticket
// @access  Public (for Chatbot or Agent)
router.post("/tickets/:id/message", async (req, res) => {
  try {
    const { sender, text } = req.body; // sender should be "user" or "agent"

    if (!text || !sender) {
      return res.status(400).json({ message: "Sender and text are required" });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.messages.push({ sender, text });
    const updatedTicket = await ticket.save();

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Server Error: Could not add message" });
  }
});

// @route   PUT /api/support/tickets/:id/close
// @desc    Close a ticket
// @access  Public / Admin
router.put("/tickets/:id/close", async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = "closed";
    const updatedTicket = await ticket.save();

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error closing ticket:", error);
    res.status(500).json({ message: "Server Error: Could not close ticket" });
  }
});

module.exports = router;
