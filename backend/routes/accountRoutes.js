import express from "express"
// Make sure to add deleteAccount to your named imports here
import {
  addAccount,
  getAccounts,
  getAccountById,
  transferMoney,
  deleteAccount, // <-- Make sure this is imported
} from "../controllers/accountController.js"
import authenticateToken from "../middleware/authMiddleware.js"

const router = express.Router()

// Existing routes
router.post("/", authenticateToken, addAccount)
router.get("/", authenticateToken, getAccounts)

// Route for getting a single account by ID
router.get("/:id", authenticateToken, getAccountById)

// Transfer route
router.post("/transfer", authenticateToken, transferMoney)

// NEW: Route for deleting an account by ID
router.delete("/:id", authenticateToken, deleteAccount) // <-- Add this line

export default router
