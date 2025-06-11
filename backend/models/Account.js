import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountType: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);

export default Account;
