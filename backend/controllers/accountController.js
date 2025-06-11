import Account from "../models/Account.js";

// Add a new account
export const addAccount = async (req, res) => {
  try {
    const { accountType, accountNumber, balance } = req.body;

    if (!accountType || !accountNumber || balance == null) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: accountType, accountNumber, balance"
      });
    }

    const parsedBalance = parseFloat(balance);
    if (isNaN(parsedBalance)) {
      return res.status(400).json({
        success: false,
        error: "Balance must be a valid number"
      });
    }

    // ✅ Debug: Check if userId is present from middleware
    const userId = req.user?.userId;
    console.log("🔍 Authenticated User ID:", userId); // <-- Add this

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User ID missing"
      });
    }

    // Check for duplicate account number
    const existingAccount = await Account.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(409).json({
        success: false,
        error: "Account number already exists"
      });
    }

    // Create new account for the authenticated user
    const newAccount = new Account({
      accountType,
      accountNumber,
      balance: parsedBalance,
      user: userId  // ✅ Set user field correctly
    });

    await newAccount.save();

    return res.status(201).json({
      success: true,
      message: "Account added successfully",
      account: {
        id: newAccount._id,
        accountType: newAccount.accountType,
        accountNumber: newAccount.accountNumber,
        balance: newAccount.balance
      }
    });

  } catch (error) {
    console.error("❌ Error adding account:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get accounts for logged-in user
export const getAccounts = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log("📄 Fetching accounts for user ID:", userId); // <-- Add this

    const accounts = await Account.find({ user: userId });

    res.status(200).json({
      success: true,
      accounts
    });

  } catch (error) {
    console.error("❌ Error fetching accounts:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch accounts"
    });
  }
};

export default {
  addAccount,
  getAccounts
};
