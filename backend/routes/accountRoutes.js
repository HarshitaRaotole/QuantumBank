import express from "express"
import { addAccount, getAccounts, getAccountById, transferMoney } from "../controllers/accountController.js" // Now correctly importing named exports
import authenticateToken from "../middleware/authMiddleware.js"

const router = express.Router()

// Existing routes
router.post("/", authenticateToken, addAccount)
router.get("/", authenticateToken, getAccounts)

// Route for getting a single account by ID
router.get("/:id", authenticateToken, getAccountById)

// Transfer route
router.post("/transfer", authenticateToken, transferMoney)

export default router
