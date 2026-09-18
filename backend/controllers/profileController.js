const User = require("../models/User");
const bcrypt = require("bcryptjs");


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};



const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      name,
      email,
      phone,
      location
    } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (email && email.toLowerCase() !== user.email) {

      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already in use"
        });
      }

      user.email = email.toLowerCase();
    }

    if (name) {
      user.name = name;
    }

    if (phone) {
      user.phone = phone;
    }

    if (location) {
      user.location = location;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password"
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};
module.exports = {
  getProfile,
  updateProfile
};