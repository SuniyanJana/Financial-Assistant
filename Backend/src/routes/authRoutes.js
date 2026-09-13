const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const {
  signup,
  login,
  getMe,
  updateSalary,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

// Validation rules
const signupRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name too long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Public routes
router.post("/signup", signupRules, validate, signup);

router.post("/login", loginRules, validate, login);

// Protected routes
router.get("/me", protect, getMe);

router.put("/salary", protect, updateSalary);

module.exports = router;