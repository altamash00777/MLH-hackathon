const Notification = require("../models/Notification");


// ==========================================
// GET FARMER NOTIFICATIONS
// ==========================================

const getFarmerNotifications = async (req, res) => {
  try {

    const farmerId = req.user.userId;

    console.log("\n========== GET NOTIFICATIONS ==========");
    console.log("Farmer ID:", farmerId);

    // Find notifications belonging to logged-in farmer
    const notifications = await Notification.find({
      recipientId: farmerId
    })
      .populate(
        "senderId",
        "name email phone location role"
      )
      .populate({
        path: "matchId",
        populate: [
          {
            path: "farmerListingId"
          },
          {
            path: "buyerRequirementId"
          }
        ]
      })
      .sort({
        createdAt: -1
      });

    console.log(
      "Notifications found:",
      notifications.length
    );

    console.log("====================================\n");

    return res.status(200).json({
      count: notifications.length,
      notifications
    });

  } catch (error) {

    console.error(
      "Get farmer notifications error:",
      error
    );

    return res.status(500).json({
      message: "Error loading notifications",
      error: error.message
    });
  }
};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markNotificationAsRead = async (req, res) => {
  try {

    const farmerId = req.user.userId;
    const { notificationId } = req.params;

    console.log(
      "\n========== MARK NOTIFICATION READ =========="
    );

    console.log(
      "Farmer ID:",
      farmerId
    );

    console.log(
      "Notification ID:",
      notificationId
    );


    // Find notification belonging to this farmer
    const notification = await Notification.findOne({
      _id: notificationId,
      recipientId: farmerId
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }


    // Mark as read
    notification.isRead = true;

    await notification.save();


    console.log(
      "Notification marked as read"
    );

    console.log(
      "=========================================\n"
    );


    return res.status(200).json({
      message: "Notification marked as read",
      notification
    });

  } catch (error) {

    console.error(
      "Mark notification error:",
      error
    );

    return res.status(500).json({
      message: "Error updating notification",
      error: error.message
    });
  }
};


module.exports = {
  getFarmerNotifications,
  markNotificationAsRead
};
