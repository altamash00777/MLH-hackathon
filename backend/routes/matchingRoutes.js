const express = require("express");

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
// CONTACT MATCH
// ==========================================

router.post(
  "/:matchId/contact",
  protect,
  contactMatch
);

router.patch(
  "/:matchId/accept",
  protect,
  acceptMatch
);



module.exports = router;