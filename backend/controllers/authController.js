const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      password,
      role
    } = req.body;

    // ==========================================
    // 1. Check required fields
    // ==========================================

    if (
      !name ||
      !email ||
      !phone ||
      !location ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // ==========================================
    // 2. Check role
    // ==========================================

    if (!["farmer", "buyer"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // ==========================================
    // 3. Check existing user
    // ==========================================

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // ==========================================
    // 4. Hash password
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ==========================================
    // 5. Create user
    // ==========================================

    const user = await User.create({
      name,
      email,
      phone,
      location,
      password: hashedPassword,
      role
    });

    // ==========================================
    // 6. Generate JWT
    // ==========================================

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // ==========================================
    // 7. Return token + user
    // ==========================================

    return res.status(201).json({
      message: "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    // ==========================================
    // 1. Check required fields
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // ==========================================
    // 2. Find user
    // ==========================================

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // ==========================================
    // 3. Compare password
    // ==========================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // ==========================================
    // 4. Generate JWT
    // ==========================================

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // ==========================================
    // 5. Return token + user
    // ==========================================

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  registerUser,
  loginUser
};