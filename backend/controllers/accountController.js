import Account from "../models/Account.js"
import Transaction from "../models/Transaction.js"
import User from "../models/User.js"
import Notification from "../models/Notification.js" // NEW: Import Notification model
import mongoose from "mongoose"

// Add a new account
export const addAccount = async (req, res) => {
  try {
    const { accountType, accountNumber, balance } = req.body

    if (!accountType || !accountNumber || balance == null) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: accountType, accountNumber, balance",
      })
    }

    const parsedBalance = Number.parseFloat(balance)
    if (isNaN(parsedBalance)) {
      return res.status(400).json({
        success: false,
        error: "Balance must be a valid number",
      })
    }

    const userId = req.user?.userId
    console.log("🔍 Authenticated User ID:", userId)

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing",
      })
    }

    // Check for duplicate account number
    const existingAccount = await Account.findOne({ accountNumber })
    if (existingAccount) {
      return res.status(409).json({
        success: false,
        error: "Account number already exists",
      })
    }

    // Create new account for the authenticated user
    const newAccount = new Account({
      accountType,
      accountNumber,
      balance: parsedBalance,
      user: userId,
    })

    await newAccount.save()

    return res.status(201).json({
      success: true,
      message: "Account added successfully",
      account: {
        id: newAccount._id,
        accountType: newAccount.accountType,
        accountNumber: newAccount.accountNumber,
        balance: newAccount.balance,
      },
    })
  } catch (error) {
    console.error("❌ Error adding account:", error)
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Get accounts for logged-in user
export const getAccounts = async (req, res) => {
  try {
    const userId = req.user?.userId
    console.log("📄 Fetching accounts for user ID:", userId)

    const accounts = await Account.find({ user: userId })

    res.status(200).json({
      success: true,
      accounts,
    })
  } catch (error) {
    console.error("❌ Error fetching accounts:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch accounts",
    })
  }
}

// Get a single account by ID
export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing",
      })
    }

    const account = await Account.findOne({ _id: id, user: userId })

    if (!account) {
      return res.status(404).json({
        success: false,
        error: "Account not found or does not belong to you",
      })
    }

    res.status(200).json({
      success: true,
      account,
    })
  } catch (error) {
    console.error("❌ Error fetching account by ID:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch account",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Transfer money with manual account number input
export const transferMoney = async (req, res) => {
  console.log("🚀 Transfer endpoint hit!")
  console.log("📝 Request body:", req.body)

  try {
    const { fromAccountNumber, toAccountNumber, amount, description } = req.body
    const userId = req.user?.userId

    console.log("👤 User ID (initiating transfer):", userId)

    // Validation
    if (!fromAccountNumber || !toAccountNumber || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: fromAccountNumber, toAccountNumber, amount",
      })
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing",
      })
    }

    const parsedAmount = Number.parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a valid positive number",
      })
    }

    if (fromAccountNumber === toAccountNumber) {
      return res.status(400).json({
        success: false,
        error: "Cannot transfer to the same account",
      })
    }

    // Find source account - MUST belong to current user
    const fromAccount = await Account.findOne({
      accountNumber: fromAccountNumber,
      user: userId,
    })

    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        error: "Source account not found or doesn't belong to you",
      })
    }
    console.log("🔍 Found fromAccount:", fromAccount.accountNumber, "User ID:", fromAccount.user)

    // Find destination account - Check if it exists in database
    const toAccount = await Account.findOne({
      accountNumber: toAccountNumber,
    })

    if (!toAccount) {
      return res.status(404).json({
        success: false,
        error: "Destination account not found",
      })
    }
    console.log("🔍 Found toAccount:", toAccount.accountNumber, "User ID:", toAccount.user)

    // Check sufficient balance
    if (fromAccount.balance < parsedAmount) {
      return res.status(400).json({
        success: false,
        error: "Insufficient funds",
      })
    }

    // Fetch usernames for related accounts
    console.log("Fetching username for toAccount.user:", toAccount.user)
    const toUser = await User.findById(toAccount.user).select("username").lean()
    console.log("Fetched toUser:", toUser)

    console.log("Fetching username for fromAccount.user:", fromAccount.user)
    const fromUser = await User.findById(fromAccount.user).select("username").lean()
    console.log("Fetched fromUser:", fromUser)

    const toUsername = toUser ? toUser.username : "Unknown User"
    const fromUsername = fromUser ? fromUser.username : "Unknown User"

    console.log("Derived toUsername:", toUsername)
    console.log("Derived fromUsername:", fromUsername)

    // Perform the transfer using MongoDB session for transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Deduct from source account
      await Account.findByIdAndUpdate(fromAccount._id, { $inc: { balance: -parsedAmount } }, { session })

      // Add to destination account
      await Account.findByIdAndUpdate(toAccount._id, { $inc: { balance: parsedAmount } }, { session })

      // Determine the description to save: if empty or not provided, save as null
      const savedDescriptionForDB = description ? description : null

      // Record debit transaction for the 'from' account
      const debitTransaction = new Transaction({
        user: userId,
        account: fromAccount._id,
        type: "Debit",
        amount: parsedAmount,
        description: savedDescriptionForDB, // Use the determined description for DB
        relatedAccount: toAccountNumber,
        relatedAccountUsername: toUsername,
        transactionId: new mongoose.Types.ObjectId().toString(),
      })
      await debitTransaction.save({ session })
      console.log("Saved debitTransaction with relatedAccountUsername:", debitTransaction.relatedAccountUsername)

      // Record credit transaction for the 'to' account
      const creditTransaction = new Transaction({
        user: toAccount.user,
        account: toAccount._id,
        type: "Credit",
        amount: parsedAmount,
        description: savedDescriptionForDB, // Use the determined description for DB
        relatedAccount: fromAccountNumber,
        relatedAccountUsername: fromUsername,
        transactionId: new mongoose.Types.ObjectId().toString(),
      })
      await creditTransaction.save({ session })
      console.log("Saved creditTransaction with relatedAccountUsername:", creditTransaction.relatedAccountUsername)

      // NEW: Create notifications for both sender and receiver
      const debitNotification = new Notification({
        user: userId,
        message: `₹${parsedAmount.toLocaleString()} debited from your account ${fromAccountNumber}.`,
        type: "debit",
        transaction: debitTransaction._id,
      })
      await debitNotification.save({ session })

      const creditNotification = new Notification({
        user: toAccount.user,
        message: `₹${parsedAmount.toLocaleString()} credited to your account ${toAccountNumber}.`,
        type: "credit",
        transaction: creditTransaction._id,
      })
      await creditNotification.save({ session })

      // Commit the transaction
      await session.commitTransaction()

      return res.status(200).json({
        success: true,
        message: "Transfer completed successfully",
        transferDetails: {
          from: fromAccount.accountNumber,
          to: toAccount.accountNumber,
          amount: parsedAmount,
          description: savedDescriptionForDB, // Return the saved description
        },
      })
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  } catch (error) {
    console.error("❌ Transfer error:", error)
    return res.status(500).json({
      success: false,
      error: "Transfer failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
