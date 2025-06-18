import Notification from "../models/Notification.js"

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing",
      })
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }) // Newest first
      .lean()

    const unreadCount = notifications.filter((n) => !n.isRead).length

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error("❌ Error fetching notifications:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch notifications",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export const markNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user?.userId
    const { notificationIds } = req.body // Array of notification IDs to mark as read

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing",
      })
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        error: "Invalid notificationIds array provided",
      })
    }

    // Update notifications for the specific user
    const result = await Notification.updateMany(
      { _id: { $in: notificationIds }, user: userId, isRead: false },
      { $set: { isRead: true } },
    )

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read.`,
    })
  } catch (error) {
    console.error("❌ Error marking notifications as read:", error)
    res.status(500).json({
      success: false,
      error: "Failed to mark notifications as read",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
