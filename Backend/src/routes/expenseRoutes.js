const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  getExpenseStats,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const expenseRules = [
  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["Food","Transport","Shopping","Bills","Health","Education","Entertainment","Other"])
    .withMessage("Invalid expense type"),
  body("amount")
    .isNumeric().withMessage("Amount must be a number")
    .isFloat({ min: 0.01 }).withMessage("Amount must be greater than 0"),
  body("mode")
    .optional()
    .isIn(["Cash","UPI","Card","Net Banking","Wallet"])
    .withMessage("Invalid payment mode"),
  body("date").optional().isISO8601().withMessage("Invalid date format"),
];

// All expense routes are protected
router.use(protect);

router.get("/stats", getExpenseStats);
router.get("/", getExpenses);
router.post("/", expenseRules, validate, addExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
