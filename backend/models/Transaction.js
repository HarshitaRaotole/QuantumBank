import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account", // Reference to the Account involved in the transaction
      required: true,
    },
    type: {
      type: String,
      enum: ["Credit", "Debit", "Transfer"], // 'Transfer' for the main transfer record, 'Credit'/'Debit' for individual account entries
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "Fund Transfer",
    },
    relatedAccount: {
      type: String, // Store the account number of the other party in the transfer
      required: false,
    },
    relatedAccountUsername: {
      // NEW: Store the username of the related account holder
      type: String,
      required: false,
    },
    transactionId: {
      type: String, // A unique ID for the overall transfer operation (now unique per document)
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
)

const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction
