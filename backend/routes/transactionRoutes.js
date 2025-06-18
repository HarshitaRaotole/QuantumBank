import express from "express"
import { getTransactions } from "../controllers/transactionController.js"
import authMiddleware from "../middleware/authMiddleware.js" // Re-import authMiddleware

const router = express.Router()

// Route to get transaction history for the authenticated user
router.get("/", authMiddleware, getTransactions) // Authentication is now enabled

export default router
