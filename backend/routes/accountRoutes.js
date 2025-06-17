import express from "express"
import { addAccount, getAccounts, transferMoney } from "../controllers/accountController.js"
import authenticateToken from "../middleware/authMiddleware.js"

const router = express.Router()

// Existing routes
router.post("/", authenticateToken, addAccount)
router.get("/", authenticateToken, getAccounts)

// Transfer route - MAKE SURE THIS EXISTS
router.post("/transfer", authenticateToken, transferMoney)

export default router
