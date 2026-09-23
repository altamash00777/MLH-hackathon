const express = require("express");

const router = express.Router();

const {
  getMyDeals,
  confirmQuantity,
  markProduceReady,
  confirmPickup,
  schedulePickup,
  completePickup,
  completeDelivery,
  completePayment
} = require("../controllers/dealController");

const { protect } = require("../middleware/authMiddleware");

// Get deals of logged-in farmer/buyer
router.get("/", protect, getMyDeals);

// Farmer confirms deal quantity
router.patch(
  "/:dealId/tasks/farmer/quantity",
  protect,
  confirmQuantity
);
// Farmer marks produce as ready
router.patch(
  "/:dealId/tasks/farmer/ready",
  protect,
  markProduceReady
);

// Buyer confirms pickup
router.patch(
  "/:dealId/tasks/buyer/pickup",
  protect,
  confirmPickup
);

// Schedule pickup
router.patch(
  "/:dealId/pickup/schedule",
  protect,
  schedulePickup
);

// Complete pickup
router.patch(
  "/:dealId/pickup/complete",
  protect,
  completePickup
);
// Complete delivery
router.patch(
  "/:dealId/delivery/complete",
  protect,
  completeDelivery
);
// Complete payment
router.patch(
  "/:dealId/payment/complete",
  protect,
  completePayment
);


module.exports = router;