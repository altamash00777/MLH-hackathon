const express = require("express");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const {
  getFarmerNotifications,
  markNotificationAsRead
} = require("../controllers/notificationController");

const router = express.Router();


// ==========================================
// GET FARMER NOTIFICATIONS
// ==========================================

router.get(
  "/",
  protect,
  authorize("farmer"),
  getFarmerNotifications
);


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

router.patch(
  "/:notificationId/read",
  protect,
  authorize("farmer"),
  markNotificationAsRead
);


module.exports = router;
