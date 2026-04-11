const Notification = require("../models/Notification")

// Get notifications for user/agency
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .populate("bookingId")
      .sort({ createdAt: -1 })
      .limit(50)

    res.status(200).json({ success: true, data: notifications })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipientId: req.user.id })

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    notification.isRead = true
    await notification.save()

    res.status(200).json({ success: true, data: notification })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipientId: req.user.id, isRead: false }, { isRead: true })

    res.status(200).json({ success: true, message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipientId: req.user.id, isRead: false })

    res.status(200).json({ success: true, count })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

