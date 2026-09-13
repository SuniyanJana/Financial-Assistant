const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ── POST /api/auth/signup ──────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        salary: user.salary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please sign up.",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        salary: user.salary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me ───────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        salary: user.salary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/auth/salary ───────────────────────────────────────────
const updateSalary = async (req, res, next) => {
  try {
    const { salary } = req.body;

    if (salary === undefined || salary < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid salary amount.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { salary },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Salary updated successfully.",
      salary: user.salary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateSalary,
};