const Expense = require("../models/Expense");

// ── POST /api/expenses ─────────────────────────────────────────────
const addExpense = async (req, res, next) => {
  try {
    const { type, amount, mode, note, date } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      type,
      amount,
      mode,
      note,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully.",
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/expenses ──────────────────────────────────────────────
// Supports query params: ?month=2024-01&limit=50&page=1
const getExpenses = async (req, res, next) => {
  try {
    const { month, limit = 50, page = 1 } = req.query;

    const filter = { user: req.user._id };

    // Filter by month if provided (format: YYYY-MM)
    if (month) {
      const [year, mon] = month.split("-").map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/expenses/stats ────────────────────────────────────────
// Returns stats for current month vs previous month
const getExpenseStats = async (req, res, next) => {
  try {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth(); // 0-indexed

    // This month range
    const thisStart = new Date(thisYear, thisMonth, 1);
    const thisEnd = new Date(thisYear, thisMonth + 1, 0, 23, 59, 59);

    // Previous month range
    const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const prevStart = new Date(prevYear, prevMonth, 1);
    const prevEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59);

    const userId = req.user._id;

    // Aggregate this month
    const [thisMonthData] = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: thisStart, $lte: thisEnd } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          highest: { $max: "$amount" },
        },
      },
    ]);

    // Aggregate previous month
    const [prevMonthData] = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: prevStart, $lte: prevEnd } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Daily breakdown for this month
    const dailyBreakdown = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: thisStart, $lte: thisEnd } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Category breakdown for this month
    const categoryBreakdown = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: thisStart, $lte: thisEnd } } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Last 6 months summary
    const sixMonthsAgo = new Date(thisYear, thisMonth - 5, 1);
    const monthlyTrend = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo, $lte: thisEnd } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const thisTotal = thisMonthData?.total || 0;
    const prevTotal = prevMonthData?.total || 0;
    const daysElapsed = now.getDate();
    const dailyAverage = daysElapsed > 0 ? thisTotal / daysElapsed : 0;

    res.status(200).json({
      success: true,
      stats: {
        thisMonth: {
          total: thisTotal,
          count: thisMonthData?.count || 0,
          highest: thisMonthData?.highest || 0,
          dailyAverage: parseFloat(dailyAverage.toFixed(2)),
        },
        previousMonth: {
          total: prevTotal,
          count: prevMonthData?.count || 0,
        },
        changePercent:
          prevTotal > 0
            ? parseFloat((((thisTotal - prevTotal) / prevTotal) * 100).toFixed(1))
            : null,
        dailyBreakdown,
        categoryBreakdown,
        monthlyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/expenses/:id ───────────────────────────────────────
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/expenses/:id ──────────────────────────────────────────
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      expense,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpenseStats,
  deleteExpense,
  updateExpense,
};
