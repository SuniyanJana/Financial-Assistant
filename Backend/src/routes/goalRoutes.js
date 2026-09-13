const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  addGoal,
  getGoals,
  updateGoal,
  updateSavedAmount,
  deleteGoal,
} = require("../controllers/goalController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

const addRules = [
  body("name").trim().notEmpty().withMessage("Goal name is required"),
  body("target").isNumeric().isFloat({ min: 1 }).withMessage("Target must be greater than 0"),
  body("saved").optional().isNumeric().isFloat({ min: 0 }).withMessage("Saved must be 0 or more"),
];

const savingsRules = [
  body("saved").isNumeric().isFloat({ min: 0 }).withMessage("Saved amount must be valid"),
];

router.get("/", getGoals);
router.post("/", addRules, validate, addGoal);
router.put("/:id", updateGoal);
router.put("/:id/savings", savingsRules, validate, updateSavedAmount);
router.delete("/:id", deleteGoal);

module.exports = router;
