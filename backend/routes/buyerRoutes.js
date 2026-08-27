const express = require("express");

const {protect,authorize} = require("../middleware/authMiddleware");

const {
  createRequirement,
  getMyRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement
} = require("../controllers/buyerController");
const router = express.Router();
// Buyer dashboard
router.get(
  "/dashboard",
  protect,
  authorize("buyer"),
  (req, res) => {
    res.json({
      message: "Welcome to Buyer Dashboard",
      user: req.user
    });
  }
);


// Create requirement
router.post(
  "/requirements",
  protect,
  authorize("buyer"),
  createRequirement
);


// Get all requirements
router.get(
  "/requirements",
  protect,
  authorize("buyer"),
  getMyRequirements
);


// Get single requirement
router.get(
  "/requirements/:id",
  protect,
  authorize("buyer"),
  getRequirementById
);


// Update requirement
router.put(
  "/requirements/:id",
  protect,
  authorize("buyer"),
  updateRequirement
);


// Delete requirement
router.delete(
  "/requirements/:id",
  protect,
  authorize("buyer"),
  deleteRequirement
);


module.exports = router;