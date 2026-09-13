const mongoose = require("mongoose");

const historyEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    value: { type: Number, required: true },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    asset: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
    },
    invested: {
      type: Number,
      required: [true, "Invested amount is required"],
      min: [0.01, "Invested amount must be greater than 0"],
    },
    currentValue: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number, // expected annual return rate %
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "withdrawn"],
      default: "active",
    },
    realisedPnl: {
      type: Number,
      default: 0, // set on withdrawal
    },
    withdrawnAmount: {
      type: Number,
      default: 0, // actual amount received on withdrawal
    },
    history: [historyEntrySchema],
  },
  { timestamps: true }
);

investmentSchema.index({ user: 1, status: 1 });

// Virtual: unrealised P&L
investmentSchema.virtual("unrealisedPnl").get(function () {
  return this.currentValue - this.invested;
});

investmentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Investment", investmentSchema);
