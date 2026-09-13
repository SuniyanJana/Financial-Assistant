const Goal = require("../models/Goal");

// ── POST /api/goals ────────────────────────────────────────────────
const addGoal = async (req, res, next) => {
  try {
    const { name, target, saved } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      name,
      target: Number(target),
      saved: saved ? Number(saved) : 0,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully.",
      goal,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/goals ─────────────────────────────────────────────────
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const summary = {
      total: goals.length,
      achieved: goals.filter((g) => g.achieved).length,
      inProgress: goals.filter((g) => !g.achieved).length,
      totalTargetAmount: goals.reduce((a, g) => a + g.target, 0),
      totalSavedAmount: goals.reduce((a, g) => a + g.saved, 0),
    };

    res.status(200).json({
      success: true,
      summary,
      goals,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/goals/:id ─────────────────────────────────────────────
const updateGoal = async (req, res, next) => {
  try {
    const { name, target, saved } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }

    if (name !== undefined) goal.name = name;
    if (target !== undefined) goal.target = Number(target);
    if (saved !== undefined) goal.saved = Number(saved);

    await goal.save(); // triggers pre-save to update achieved

    const justAchieved =
      goal.achieved && Number(saved) >= goal.target && goal.saved < goal.target;

    res.status(200).json({
      success: true,
      message: goal.achieved
        ? "🎉 Congratulations! Goal achieved!"
        : "Goal updated successfully.",
      achieved: goal.achieved,
      goal,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/goals/:id/savings ─────────────────────────────────────
// Specific endpoint just for updating saved amount
const updateSavedAmount = async (req, res, next) => {
  try {
    const { saved } = req.body;

    if (saved === undefined || Number(saved) < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid saved amount.",
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }

    goal.saved = Number(saved);
    await goal.save();

    res.status(200).json({
      success: true,
      message: goal.achieved
        ? "🎉 Goal achieved! Well done!"
        : "Savings updated.",
      achieved: goal.achieved,
      remaining: goal.remaining,
      percentage: goal.percentage,
      goal,
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/goals/:id ──────────────────────────────────────────
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addGoal,
  getGoals,
  updateGoal,
  updateSavedAmount,
  deleteGoal,
};
