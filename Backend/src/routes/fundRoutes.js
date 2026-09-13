const express = require("express");

const router = express.Router();

const {
  getFundSummary,
  updateIncome,
  getHealthScore,
} = require("../controllers/fundController");

const {
  protect,
} = require("../middleware/auth");

// All fund routes require authentication
router.use(protect);

// Get fund tracker summary
router.get(
  "/summary",
  getFundSummary
);

// Update monthly income
router.put(
  "/income",
  updateIncome
);

// Get financial health score
router.get(
  "/health-score",
  getHealthScore
);

module.exports = router;