const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: [true, "Expense type is required"],
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Health",
        "Education",
        "Entertainment",
        "Other",
      ],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    mode: {
      type: String,
      required: [true, "Payment mode is required"],
      enum: ["Cash", "UPI", "Card", "Net Banking", "Wallet"],
      default: "Cash",
    },
    note: {
      type: String,
      trim: true,
      maxlength: [300, "Note cannot exceed 300 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for fast user+date queries
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
