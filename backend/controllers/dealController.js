const Deal = require("../models/Deal");

// Get all deals for logged-in user
const getMyDeals = async (req, res) => {
  try {
    const userId = req.user._id;

    const deals = await Deal.find({
      $or: [
        { farmerId: userId },
        { buyerId: userId }
      ]
    })
      .populate("farmerId", "name email phone")
      .populate("buyerId", "name email phone")
      .populate("farmerListingId")
      .populate("buyerRequirementId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deals.length,
      deals
    });

  } catch (error) {
    console.error("Get deals error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch deals",
      error: error.message
    });
  }
};


// Farmer confirms the quantity for a deal
const confirmQuantity = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    // Only the farmer can confirm quantity
    if (deal.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the farmer can confirm the quantity"
      });
    }

    deal.tasks.farmer.quantityConfirmed = true;

    await deal.save();

    res.status(200).json({
      success: true,
      message: "Quantity confirmed successfully",
      deal
    });

  } catch (error) {
    console.error("Confirm quantity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to confirm quantity",
      error: error.message
    });
  }
};

// Farmer marks produce as ready
const markProduceReady = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    // Only the farmer can mark produce as ready
    if (deal.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the farmer can mark produce as ready"
      });
    }

    // Quantity should be confirmed first
    if (!deal.tasks.farmer.quantityConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Please confirm the quantity first"
      });
    }

    deal.tasks.farmer.produceReady = true;

    await deal.save();

    res.status(200).json({
      success: true,
      message: "Produce marked as ready successfully",
      deal
    });

  } catch (error) {
    console.error("Mark produce ready error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark produce as ready",
      error: error.message
    });
  }
};
// Buyer confirms pickup
const confirmPickup = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    // Only the buyer can confirm pickup
    if (deal.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the buyer can confirm the pickup"
      });
    }

    // Farmer must mark produce as ready first
    if (!deal.tasks.farmer.produceReady) {
      return res.status(400).json({
        success: false,
        message: "Pickup cannot be confirmed until the farmer marks the produce as ready"
      });
    }

    deal.tasks.buyer.pickupConfirmed = true;

    await deal.save();

    res.status(200).json({
      success: true,
      message: "Pickup confirmed successfully",
      deal
    });

  } catch (error) {
    console.error("Confirm pickup error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to confirm pickup",
      error: error.message
    });
  }
};


// Schedule pickup for a deal
const schedulePickup = async (req, res) => {
  try {
    const { dealId } = req.params;
    const { pickupDate, pickupTime } = req.body;

    // Validate input
    if (!pickupDate || !pickupTime) {
      return res.status(400).json({
        success: false,
        message: "Pickup date and time are required"
      });
    }

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    // Only farmer or buyer involved in this deal can schedule pickup
    const isFarmer =
      deal.farmerId.toString() === req.user._id.toString();

    const isBuyer =
      deal.buyerId.toString() === req.user._id.toString();

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this deal"
      });
    }

    // Pickup can only be scheduled after
    // farmer has confirmed quantity,
    // farmer has marked produce ready,
    // and buyer has confirmed pickup
    if (!deal.tasks.farmer.quantityConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be confirmed first"
      });
    }

    if (!deal.tasks.farmer.produceReady) {
      return res.status(400).json({
        success: false,
        message: "Produce must be marked ready first"
      });
    }

    if (!deal.tasks.buyer.pickupConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Buyer must confirm pickup first"
      });
    }

    // Save pickup details
    deal.transport.pickupDate = new Date(pickupDate);
    deal.transport.pickupTime = pickupTime;

    deal.transport.status = "scheduled";

    deal.tasks.logistics.pickupScheduled = true;

    deal.status = "pickup_scheduled";

    await deal.save();

    res.status(200).json({
      success: true,
      message: "Pickup scheduled successfully",
      deal
    });

  } catch (error) {
    console.error("Schedule pickup error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to schedule pickup",
      error: error.message
    });
  }
};

// Mark pickup as completed
const completePickup = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    // Only farmer or buyer involved in this deal can confirm pickup completion
    const isFarmer =
      deal.farmerId.toString() === req.user._id.toString();

    const isBuyer =
      deal.buyerId.toString() === req.user._id.toString();

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this deal"
      });
    }

    // Pickup must be scheduled first
    if (!deal.tasks.logistics.pickupScheduled) {
      return res.status(400).json({
        success: false,
        message: "Pickup must be scheduled first"
      });
    }

    // Complete pickup
    deal.tasks.logistics.pickupCompleted = true;

    deal.transport.status = "picked_up";

    deal.status = "in_transit";

    await deal.save();

    res.status(200).json({
      success: true,
      message: "Pickup completed successfully",
      deal
    });

  } catch (error) {
    console.error("Complete pickup error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete pickup",
      error: error.message
    });
  }
};

// Mark delivery as completed
const completeDelivery = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    // Only farmer or buyer involved in this deal can confirm delivery
    const isFarmer =
      deal.farmerId.toString() === req.user._id.toString();

    const isBuyer =
      deal.buyerId.toString() === req.user._id.toString();

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this deal"
      });
    }

    // Pickup must be completed first
    if (!deal.tasks.logistics.pickupCompleted) {
      return res.status(400).json({
        success: false,
        message: "Pickup must be completed first"
      });
    }

    // Complete delivery
    deal.tasks.logistics.deliveryCompleted = true;

    deal.transport.status = "delivered";

    deal.status = "delivered";

    await deal.save();

    res.status(200).json({
      success: true,
      message: "Delivery completed successfully",
      deal
    });

  } catch (error) {
    console.error("Complete delivery error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete delivery",
      error: error.message
    });
  }
};
// Mark payment as completed
const completePayment = async (req, res) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    // Only farmer or buyer involved in this deal can confirm payment
    const isFarmer =
      deal.farmerId.toString() === req.user._id.toString();

    const isBuyer =
      deal.buyerId.toString() === req.user._id.toString();

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this deal"
      });
    }

    // Delivery must be completed first
    if (!deal.tasks.logistics.deliveryCompleted) {
      return res.status(400).json({
        success: false,
        message: "Payment can be completed only after delivery"
      });
    }

    // Prevent duplicate payment completion
    if (deal.payment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment is already completed"
      });
    }

deal.tasks.payment.completed = true;

deal.payment.status = "completed";
deal.payment.paidAt = new Date();

deal.status = "completed";

    await deal.save();

    res.status(200).json({
      success: true,
      message: "Payment marked as completed successfully",
      deal
    });

  } catch (error) {
    console.error("Complete payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete payment",
      error: error.message
    });
  }
};


module.exports = {
  getMyDeals,
  confirmQuantity,
  markProduceReady,
  confirmPickup,
  schedulePickup,
  completePickup,
  completeDelivery,
  completePayment
};