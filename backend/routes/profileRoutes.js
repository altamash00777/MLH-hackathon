const express = require("express");

const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get profile
router.get(
  "/",
  protect,
  getProfile
);


// Update profile
router.put(
  "/",
  protect,
  updateProfile
);


module.exports = router;