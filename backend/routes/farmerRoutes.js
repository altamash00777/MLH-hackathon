const express = require("express");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const {
  createListing,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing
} = require("../controllers/farmerController");

const router = express.Router();


// Farmer dashboard
router.get(
  "/dashboard",
  protect,
  authorize("farmer"),
  (req, res) => {
    res.json({
      message: "Welcome to Farmer Dashboard",
      user: req.user
    });
  }
);


// Create crop listing
router.post(
  "/listings",
  protect,
  authorize("farmer"),
  createListing
);


// Get all my listings
router.get(
  "/listings",
  protect,
  authorize("farmer"),
  getMyListings
);


// Get single listing
router.get(
  "/listings/:id",
  protect,
  authorize("farmer"),
  getListingById
);


// Update listing
router.put(
  "/listings/:id",
  protect,
  authorize("farmer"),
  updateListing
);


// Delete listing
router.delete(
  "/listings/:id",
  protect,
  authorize("farmer"),
  deleteListing
);


module.exports = router;