import Transaction from "../models/Transaction.js"

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user?.userId // Assuming authMiddleware adds user info to req

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing",
      })
    }

    // Fetch transactions for the authenticated user, sorted by creation date (newest first)
    // You might want to add pagination or filters here for large datasets
    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("account", "accountNumber accountType") // Populate account details if needed
      .lean() // Return plain JavaScript objects

    // Format the date for better display on the frontend
    const formattedTransactions = transactions.map((txn) => ({
      ...txn,
      date: new Date(txn.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }))

    res.status(200).json({
      success: true,
      transactions: formattedTransactions,
    })
  } catch (error) {
    console.error("❌ Error fetching transactions:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
