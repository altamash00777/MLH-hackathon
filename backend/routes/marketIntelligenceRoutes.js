const express = require("express");

const router = express.Router();

const {
  getAvailableCrops,
  getAvailableStates,
  getCropPriceTrend,
} = require("../controllers/marketIntelligenceController");


router.get("/crops", getAvailableCrops);

router.get("/states", getAvailableStates);

router.get("/trend/:crop", getCropPriceTrend);


module.exports = router;