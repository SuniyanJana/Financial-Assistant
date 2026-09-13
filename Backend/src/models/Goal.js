const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Goal name is required"],
      trim: true,
      maxlength: [100, "Goal name cannot exceed 100 characters"],
    },
    target: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [1, "Target must be greater than 0"],
    },
    saved: {
      type: Number,
      default: 0,
      min: [0, "Saved amount cannot be negative"],
    },
    achieved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-mark as achieved when saved >= target
goalSchema.pre("save", function (next) {
  if (this.saved >= this.target) {
    this.achieved = true;
  } else {
    this.achieved = false;
  }
  next();
});

// Virtual: remaining
goalSchema.virtual("remaining").get(function () {
  return Math.max(0, this.target - this.saved);
});

// Virtual: percentage
goalSchema.virtual("percentage").get(function () {
  return this.target > 0
    ? Math.min(100, ((this.saved / this.target) * 100).toFixed(1))
    : 0;
});

goalSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Goal", goalSchema);
