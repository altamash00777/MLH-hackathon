const express = require("express");

const router = express.Router();

const {
  getPrices,
  getCropList,
  getMandiList
} = require("../controllers/mandiController");

router.get("/prices", getPrices);

router.get("/crops", getCropList);

router.get("/mandis", getMandiList);

module.exports = router;