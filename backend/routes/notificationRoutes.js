import express from "express"
import { getNotifications, markNotificationsAsRead } from "../controllers/notificationController.js"
import authenticateToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authenticateToken, getNotifications)
router.post("/mark-read", authenticateToken, markNotificationsAsRead)

export default router
