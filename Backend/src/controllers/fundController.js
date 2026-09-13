const Expense = require("../models/Expense");
const Investment = require("../models/Investment");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
// GET /api/fund/summary
// Full fund tracker data for the logged-in user
// ─────────────────────────────────────────────────────────────
const getFundSummary = async (req, res, next) => {
  try {
    // Get only the logged-in user's data
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salary = Number(user.salary || 0);

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();

    // ─────────────────────────────────────────────────────────
    // Current month expenses
    // ─────────────────────────────────────────────────────────
    const thisStart = new Date(thisYear, thisMonth, 1);

    const thisEnd = new Date(
      thisYear,
      thisMonth + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [thisMonthAgg] = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: thisStart,
            $lte: thisEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // ─────────────────────────────────────────────────────────
    // Previous month expenses
    // ─────────────────────────────────────────────────────────
    const prevMonth =
      thisMonth === 0 ? 11 : thisMonth - 1;

    const prevYear =
      thisMonth === 0
        ? thisYear - 1
        : thisYear;

    const prevStart = new Date(
      prevYear,
      prevMonth,
      1
    );

    const prevEnd = new Date(
      prevYear,
      prevMonth + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [prevMonthAgg] = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: prevStart,
            $lte: prevEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // ─────────────────────────────────────────────────────────
    // Withdrawn investments
    // ─────────────────────────────────────────────────────────
    const withdrawnInvestments =
      await Investment.find({
        user: req.user._id,
        status: "withdrawn",
      });

    const investmentReturns =
      withdrawnInvestments.reduce(
        (total, investment) =>
          total +
          Number(investment.withdrawnAmount || 0),
        0
      );

    // ─────────────────────────────────────────────────────────
    // Calculations
    // ─────────────────────────────────────────────────────────
    const thisMonthTotal =
      Number(thisMonthAgg?.total || 0);

    const prevMonthTotal =
      Number(prevMonthAgg?.total || 0);

    const daysElapsed = now.getDate();

    const dailyAverage =
      daysElapsed > 0
        ? thisMonthTotal / daysElapsed
        : 0;

    // Current balance
    const activeInvestments = await Investment.find({
  user: req.user._id,
  status: "active",
});

const activeInvestmentAmount = activeInvestments.reduce(
  (total, investment) =>
    total + Number(investment.invested || 0),
  0
);

const balance =
  salary -
  thisMonthTotal -
  activeInvestmentAmount +
  investmentReturns;

    // Emergency fund = 15% of salary
    const emergencyFund =
      salary * 0.15;

    // How many days the balance can last
    let daysLeft = 0;

    if (dailyAverage > 0 && balance > 0) {
      daysLeft = Math.floor(
        balance / dailyAverage
      );
    }

    // ─────────────────────────────────────────────────────────
    // Forecast
    // ─────────────────────────────────────────────────────────
    const forecastDays =
      Math.min(
        Math.max(daysLeft + 3, 7),
        30
      );

    const forecast = Array.from(
      { length: forecastDays },
      (_, i) => ({
        day: `D${i + 1}`,

        balance: Math.max(
          0,
          parseFloat(
            (
              balance -
              dailyAverage * i
            ).toFixed(2)
          )
        ),
      })
    );

    // ─────────────────────────────────────────────────────────
    // Response
    // ─────────────────────────────────────────────────────────
    res.status(200).json({
      success: true,

      fund: {
        salary,

        thisMonthExpenses:
          parseFloat(
            thisMonthTotal.toFixed(2)
          ),

        previousMonthExpenses:
          parseFloat(
            prevMonthTotal.toFixed(2)
          ),

        investmentReturns:
          parseFloat(
            investmentReturns.toFixed(2)
          ),

        balance:
          parseFloat(
            balance.toFixed(2)
          ),

        emergencyFund:
          parseFloat(
            emergencyFund.toFixed(2)
          ),

        dailyAverage:
          parseFloat(
            dailyAverage.toFixed(2)
          ),

        daysLeft,

        budgetUsedPercent:
          salary > 0
            ? parseFloat(
                (
                  (thisMonthTotal /
                    salary) *
                  100
                ).toFixed(1)
              )
            : 0,

        forecast,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/fund/income
// Update monthly income for the logged-in user
// ─────────────────────────────────────────────────────────────
const updateIncome = async (
  req,
  res,
  next
) => {
  try {
    const { salary } = req.body;

    const amount = Number(salary);

    // Validate salary
    if (
      salary === undefined ||
      salary === null ||
      salary === "" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid monthly income.",
      });
    }

    // Update ONLY the logged-in user's salary
    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        {
          salary: amount,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Monthly income updated successfully.",

      salary: Number(
        user.salary || 0
      ),
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/fund/health-score
// Financial health score + monthly trend
// ─────────────────────────────────────────────────────────────
const getHealthScore = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salary = Number(
      user.salary || 0
    );

    const now = new Date();
    const thisYear =
      now.getFullYear();

    const thisMonth =
      now.getMonth();

    // ─────────────────────────────────────────────────────────
    // Current month expenses
    // ─────────────────────────────────────────────────────────
    const thisStart = new Date(
      thisYear,
      thisMonth,
      1
    );

    const thisEnd = new Date(
      thisYear,
      thisMonth + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [thisMonthAgg] =
      await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
            date: {
              $gte: thisStart,
              $lte: thisEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const thisMonthTotal =
      Number(
        thisMonthAgg?.total || 0
      );

    // ─────────────────────────────────────────────────────────
    // Active investments
    // ─────────────────────────────────────────────────────────
    const activeInvestments =
      await Investment.find({
        user: req.user._id,
        status: "active",
      });

    const totalInvested =
      activeInvestments.reduce(
        (total, investment) =>
          total +
          Number(
            investment.invested || 0
          ),
        0
      );

    const totalCurrentValue =
      activeInvestments.reduce(
        (total, investment) =>
          total +
          Number(
            investment.currentValue ||
              0
          ),
        0
      );

    // ─────────────────────────────────────────────────────────
    // Score calculation
    // ─────────────────────────────────────────────────────────
    const savingsRate =
      salary > 0
        ? ((salary -
            thisMonthTotal) /
            salary) *
          100
        : 0;

    const investmentRate =
      salary > 0
        ? (totalInvested /
            salary) *
          100
        : 0;

    const score = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          savingsRate * 0.5 +
            Math.min(
              investmentRate,
              30
            ) *
              0.8 +
            (totalInvested > 0
              ? 20
              : 0)
        )
      )
    );

    // ─────────────────────────────────────────────────────────
    // Last 6 months trend
    // ─────────────────────────────────────────────────────────
    const sixMonthsAgo =
      new Date(
        thisYear,
        thisMonth - 5,
        1
      );

    const monthlyTrend =
      await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
            date: {
              $gte: sixMonthsAgo,
              $lte: thisEnd,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$date",
              },
            },

            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    // ─────────────────────────────────────────────────────────
    // Trend direction
    // ─────────────────────────────────────────────────────────
    let trendDirection =
      "stable";

    if (monthlyTrend.length >= 2) {
      const last =
        monthlyTrend[
          monthlyTrend.length - 1
        ].total;

      const previous =
        monthlyTrend[
          monthlyTrend.length - 2
        ].total;

      trendDirection =
        last > previous
          ? "up"
          : last < previous
          ? "down"
          : "stable";
    }

    res.status(200).json({
      success: true,

      health: {
        score,

        label:
          score >= 70
            ? "Excellent"
            : score >= 40
            ? "Average"
            : "Needs Improvement",

        savingsRate:
          parseFloat(
            savingsRate.toFixed(1)
          ),

        investments: {
          totalInvested,

          totalCurrentValue,

          unrealisedPnl:
            totalCurrentValue -
            totalInvested,

          count:
            activeInvestments.length,
        },

        monthlyTrend,

        trendDirection,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFundSummary,
  updateIncome,
  getHealthScore,
};