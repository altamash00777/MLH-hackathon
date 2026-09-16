const express = require("express");

const calculateDistance =
  require("../utils/distanceCalculator");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const {
  findFarmerMatches,
  findBuyerMatches,
  contactMatch,
  acceptMatch
} = require("../controllers/matchingController");


const router = express.Router();


// ==========================================
// FARMER MATCHES
// ==========================================

router.get(
  "/farmer",
  protect,
  authorize("farmer"),
  findFarmerMatches
);


// ==========================================
// BUYER MATCHES
// ==========================================

router.get(
  "/buyer",
  protect,
  authorize("buyer"),
  findBuyerMatches
);


// ==========================================
// DISTANCE TEST
// ==========================================

router.get(
  "/distance-test",
  protect,
  async (req, res) => {

    try {

      const result =
        await calculateDistance(
          "Lucknow, Uttar Pradesh, India",
          "Kanpur, Uttar Pradesh, India"
        );

      res.status(200).json(result);

    } catch (error) {

      console.error(
        "Distance test error:",
        error.message
      );

      res.status(500).json({
        message: "Distance calculation failed",
        error: error.message
      });

    }

  }
);


// ==========================================
// FARMER SENDS CONNECTION REQUEST
// ==========================================

router.post(
  "/:matchId/contact",
  protect,
  authorize("farmer"),
  contactMatch
);


// ==========================================
// BUYER ACCEPTS CONNECTION REQUEST
// ==========================================

router.patch(
  "/:matchId/accept",
  protect,
  authorize("buyer"),
  acceptMatch
);


module.exports = router;
