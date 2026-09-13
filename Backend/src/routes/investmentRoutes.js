const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  addInvestment,
  getInvestments,
  updateInvestmentValue,
  withdrawInvestment,
  getInvestmentActivity,
  deleteInvestment,
} = require("../controllers/investmentController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

const addRules = [
  body("asset").trim().notEmpty().withMessage("Asset name is required"),
  body("amount").isNumeric().isFloat({ min: 0.01 }).withMessage("Amount must be greater than 0"),
  body("rate").optional().isNumeric().withMessage("Rate must be a number"),
];

const updateValueRules = [
  body("currentValue").isNumeric().isFloat({ min: 0 }).withMessage("Current value must be a valid number"),
];

const withdrawRules = [
  body("withdrawAmount").isNumeric().isFloat({ min: 0 }).withMessage("Withdrawal amount must be valid"),
];

router.get("/activity", getInvestmentActivity);
router.get("/", getInvestments);
router.post("/", addRules, validate, addInvestment);
router.put("/:id/update-value", updateValueRules, validate, updateInvestmentValue);
router.put("/:id/withdraw", withdrawRules, validate, withdrawInvestment);
router.delete("/:id", deleteInvestment);

module.exports = router;
