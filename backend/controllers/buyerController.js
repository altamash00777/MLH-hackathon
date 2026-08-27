const BuyerRequirement = require("../models/BuyerRequirement");


// Create requirement
const createRequirement = async (req, res) => {
  try {
    const {
      cropName,
      requiredQuantity,
      quality,
      grade,
      location,
      expectedPrice
    } = req.body;

    if (
      !cropName ||
      !requiredQuantity ||
      !quality ||
      !grade ||
      !location ||
      !expectedPrice
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const requirement = await BuyerRequirement.create({
      buyerId: req.user.userId,
      cropName,
      requiredQuantity,
      quality,
      grade,
      location,
      expectedPrice
    });

    res.status(201).json({
      message: "Buyer requirement created successfully",
      requirement
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get all requirements of logged-in buyer
const getMyRequirements = async (req, res) => {
  try {
    const requirements = await BuyerRequirement.find({
      buyerId: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: requirements.length,
      requirements
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get single requirement
const getRequirementById = async (req, res) => {
  try {
    const requirement = await BuyerRequirement.findOne({
      _id: req.params.id,
      buyerId: req.user.userId
    });

    if (!requirement) {
      return res.status(404).json({
        message: "Requirement not found"
      });
    }

    res.status(200).json({
      requirement
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update requirement
const updateRequirement = async (req, res) => {
  try {
    const requirement = await BuyerRequirement.findOne({
      _id: req.params.id,
      buyerId: req.user.userId
    });

    if (!requirement) {
      return res.status(404).json({
        message: "Requirement not found"
      });
    }

    const {
      cropName,
      requiredQuantity,
      quality,
      grade,
      location,
      expectedPrice,
      status
    } = req.body;

    requirement.cropName =
      cropName ?? requirement.cropName;

    requirement.requiredQuantity =
      requiredQuantity ?? requirement.requiredQuantity;

    requirement.quality =
      quality ?? requirement.quality;

    requirement.grade =
      grade ?? requirement.grade;

    requirement.location =
      location ?? requirement.location;

    requirement.expectedPrice =
      expectedPrice ?? requirement.expectedPrice;

    requirement.status =
      status ?? requirement.status;

    await requirement.save();

    res.status(200).json({
      message: "Requirement updated successfully",
      requirement
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete requirement
const deleteRequirement = async (req, res) => {
  try {
    const requirement = await BuyerRequirement.findOne({
      _id: req.params.id,
      buyerId: req.user.userId
    });

    if (!requirement) {
      return res.status(404).json({
        message: "Requirement not found"
      });
    }

    await BuyerRequirement.deleteOne({
      _id: requirement._id
    });

    res.status(200).json({
      message: "Requirement deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createRequirement,
  getMyRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement
};