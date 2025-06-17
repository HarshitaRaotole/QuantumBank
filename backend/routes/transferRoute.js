import express from "express"
import { transferMoney } from "../controllers/accountController.js"
import authenticateToken from "../middleware/authMiddleware.js"

const router = express.Router()

// Transfer money between accounts
router.post("/", authenticateToken, transferMoney)

// Get transfer history (optional - you can implement this later)
router.get("/history", authenticateToken, async (req, res) => {
  try {
    // This is a placeholder for transfer history functionality
    // You can implement this when you create a Transaction model
    res.status(200).json({
      success: true,
      message: "Transfer history endpoint - to be implemented",
      transfers: []
    })
  } catch (error) {
    console.error("❌ Error fetching transfer history:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch transfer history"
    })
  }
})

// Validate account number (optional helper endpoint)
router.post("/validate-account", authenticateToken, async (req, res) => {
  try {
    const { accountNumber } = req.body
    
    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        error: "Account number is required"
      })
    }

    // Import Account model to check if account exists
    const Account = (await import("../models/Account.js")).default
    
    const account = await Account.findOne({ accountNumber })
      .select("accountNumber accountType")
      .populate("user", "firstName lastName")

    if (!account) {
      return res.status(404).json({
        success: false,
        error: "Account not found"
      })
    }

    res.status(200).json({
      success: true,
      data: {
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountHolder: account.user ? `${account.user.firstName} ${account.user.lastName}` : "Unknown"
      }
    })

  } catch (error) {
    console.error("❌ Error validating account:", error)
    res.status(500).json({
      success: false,
      error: "Failed to validate account"
    })
  }
})

export default router