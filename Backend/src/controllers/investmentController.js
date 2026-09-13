const Investment = require("../models/Investment");
const User = require("../models/User");

// ── POST /api/investments ──────────────────────────────────────────
const addInvestment = async (req, res, next) => {
  try {
    const { asset, amount, rate } = req.body;

    const investment = await Investment.create({
      user: req.user._id,
      asset,
      invested: Number(amount),
      currentValue: Number(amount),
      rate: rate ? Number(rate) : 0,
      status: "active",
      history: [
        {
          date: new Date(),
          value: Number(amount),
          note: "Initial investment",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Investment added successfully.",
      investment,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/investments ───────────────────────────────────────────
const getInvestments = async (req, res, next) => {
  try {
    const { status } = req.query; // ?status=active | withdrawn
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const investments = await Investment.find(filter).sort({ createdAt: -1 });

    // Portfolio summary
    const active = investments.filter((i) => i.status === "active");
    const withdrawn = investments.filter((i) => i.status === "withdrawn");

    const summary = {
      totalInvested: active.reduce((a, i) => a + i.invested, 0),
      totalCurrentValue: active.reduce((a, i) => a + i.currentValue, 0),
      unrealisedPnl:
        active.reduce((a, i) => a + i.currentValue, 0) -
        active.reduce((a, i) => a + i.invested, 0),
      realisedPnl: withdrawn.reduce((a, i) => a + i.realisedPnl, 0),
      activeCount: active.length,
      withdrawnCount: withdrawn.length,
    };

    res.status(200).json({
      success: true,
      summary,
      investments,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/investments/:id/update-value ──────────────────────────
// User reports whether investment went up or down
const updateInvestmentValue = async (req, res, next) => {
  try {
    const { currentValue, note } = req.body;

    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "active",
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Active investment not found.",
      });
    }

    const newValue = Number(currentValue);
    const previousValue = investment.currentValue;
    const change = newValue - previousValue;
    const changePercent =
      previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : 0;
    const direction = change >= 0 ? "up" : "down";

    // Push to history
    investment.history.push({
      date: new Date(),
      value: newValue,
      note: note || `Value updated — went ${direction} by ₹${Math.abs(change).toFixed(0)}`,
    });

    investment.currentValue = newValue;
    await investment.save();

    res.status(200).json({
      success: true,
      message: `Investment value updated. It went ${direction} by ₹${Math.abs(change).toFixed(0)} (${changePercent}%).`,
      direction,
      change,
      changePercent: Number(changePercent),
      previousValue,
      newValue,
      totalPnl: newValue - investment.invested,
      investment,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/investments/:id/withdraw ─────────────────────────────
// User withdraws/sells — profit or loss is calculated and added to fund
const withdrawInvestment = async (req, res, next) => {
  try {
    const { withdrawAmount } = req.body;

    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "active",
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Active investment not found.",
      });
    }

    const received = Number(withdrawAmount);
    const pnl = received - investment.invested;
    const isProfit = pnl >= 0;

    // Update investment record
    investment.status = "withdrawn";
    investment.realisedPnl = pnl;
    investment.withdrawnAmount = received;
    investment.currentValue = received;
    investment.history.push({
      date: new Date(),
      value: received,
      note: `Withdrawn — ${isProfit ? "Profit" : "Loss"}: ₹${Math.abs(pnl).toFixed(0)}`,
    });

    await investment.save();

    // The withdrawn amount (including profit/loss) is now available.
    // In a real system you'd add it to a "wallet" or "fund balance" field.
    // We return it so the frontend can update accordingly.
    res.status(200).json({
      success: true,
      message: `Investment withdrawn. You made a ${isProfit ? "profit" : "loss"} of ₹${Math.abs(pnl).toFixed(0)}.`,
      result: {
        asset: investment.asset,
        invested: investment.invested,
        received,
        pnl,
        isProfit,
        percentageReturn:
          investment.invested > 0
            ? parseFloat(((pnl / investment.invested) * 100).toFixed(1))
            : 0,
      },
      amountAddedToFund: received, // full received amount goes back to fund
      investment,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/investments/activity ─────────────────────────────────
// Returns all update & withdrawal events across all investments
const getInvestmentActivity = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const investments = await Investment.find({ user: req.user._id });

    // Flatten all history entries across investments
    const activity = [];
    investments.forEach((inv) => {
      inv.history.forEach((h, idx) => {
        if (idx === 0) return; // skip initial entry
        const prev = inv.history[idx - 1];
        activity.push({
          investmentId: inv._id,
          asset: inv.asset,
          type: inv.status === "withdrawn" && idx === inv.history.length - 1
            ? "withdraw"
            : "update",
          date: h.date,
          value: h.value,
          previousValue: prev.value,
          change: h.value - prev.value,
          note: h.note,
          investmentStatus: inv.status,
        });
      });
    });

    // Sort newest first and limit
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginated = activity.slice(0, Number(limit));

    res.status(200).json({
      success: true,
      count: paginated.length,
      activity: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/investments/:id ────────────────────────────────────
const deleteInvestment = async (req, res, next) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Investment removed.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addInvestment,
  getInvestments,
  updateInvestmentValue,
  withdrawInvestment,
  getInvestmentActivity,
  deleteInvestment,
};
