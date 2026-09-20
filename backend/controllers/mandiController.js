const {
  getMandiPrices,
  getCrops,
  getMandis
} = require("../services/mandiService");

const getPrices = async (req, res) => {
  try {
    const {
      crop,
      mandi,
      state,
      days
    } = req.query;

    const prices = await getMandiPrices({
      crop,
      mandi,
      state,
      days
    });

    res.status(200).json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    console.error(
      "Mandi Controller Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch mandi prices"
    });
  }
};


const getCropList = async (req, res) => {
  try {
    const crops = await getCrops();

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    console.error(
      "Crop List Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch crops"
    });
  }
};


const getMandiList = async (req, res) => {
  try {
    const {
      state,
      crop
    } = req.query;

    const mandis = await getMandis({
      state,
      crop
    });

    res.status(200).json({
      success: true,
      count: mandis.length,
      data: mandis
    });
  } catch (error) {
    console.error(
      "Mandi List Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch mandis"
    });
  }
};


module.exports = {
  getPrices,
  getCropList,
  getMandiList
};