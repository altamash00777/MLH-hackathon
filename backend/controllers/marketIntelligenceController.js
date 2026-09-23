const {
  connectSnowflake,
  executeQuery,
} = require("../config/snowflake");

// =========================================================
// Farmer-Friendly Crop Mapping
// =========================================================

const CROP_MAPPING = {
  Rice: ["Rice"],

  Wheat: ["Wheat"],

  Potato: ["Potato"],

  Onion: ["Onion"],

  Tomato: ["Tomato"],

  Maize: ["Maize"],

  Soyabean: ["Soyabean"],

  Mustard: ["Mustard"],

  Gram: ["Bengal Gram(Gram)(Whole)"],

  Arhar: [
    "Pegeon Pea(Arhar Fali)",
    "Red gram split/Arhar dal/Tur dal",
    "Red gram/Arhar/Tur(whole)",
  ],

  Bajra: ["Bajra(Pearl Millet/Cumbu)"],

  Groundnut: [
    "Groundnut",
    "Groundnut pods(raw)",
    "Groundnut(Split)",
  ],
};

// =========================================================
// Get Available Crops
// =========================================================

const getAvailableCrops = async (req, res) => {
  try {
    const crops = Object.keys(CROP_MAPPING);

    res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    console.error("❌ Market Intelligence Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch available crops",
    });
  }
};

// =========================================================
// Get Current Crop Market Prices
// =========================================================

const getCropPriceTrend = async (req, res) => {
  try {
    const { crop } = req.params;
    const { state } = req.query;

    // =====================================================
    // Validate Crop
    // =====================================================

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: "Crop is required",
      });
    }

    // Find farmer-friendly crop name
    const cropName = Object.keys(CROP_MAPPING).find(
      (name) => name.toLowerCase() === crop.toLowerCase()
    );

    if (!cropName) {
      return res.status(404).json({
        success: false,
        message: "Crop not supported",
      });
    }

    // Raw commodity names stored in Snowflake
    const commodities = CROP_MAPPING[cropName];

    // =====================================================
    // Connect to Snowflake
    // =====================================================

    const connection = await connectSnowflake();

    const placeholders = commodities
      .map(() => "?")
      .join(", ");

    // =====================================================
    // 1. CURRENT PRICE SUMMARY
    // =====================================================

    const summaryQuery = `
      SELECT
        MAX(ARRIVAL_DATE) AS LATEST_DATE,

        AVG(MODAL_PRICE) AS AVERAGE_PRICE,

        MIN(MODAL_PRICE) AS MIN_PRICE,

        MAX(MODAL_PRICE) AS MAX_PRICE

      FROM MANDI_PRICES

      WHERE COMMODITY IN (${placeholders})

      ${state ? "AND STATE = ?" : ""}
    `;

    const summaryRows = await executeQuery(
      connection,
      summaryQuery,
      state ? [...commodities, state] : commodities
    );

    const summary = summaryRows[0];

    // =====================================================
    // 2. LATEST MARKET PRICES
    // =====================================================

    const latestQuery = `
      SELECT
        STATE,
        DISTRICT,
        MARKET,
        COMMODITY,
        VARIETY,
        GRADE,
        ARRIVAL_DATE,
        MIN_PRICE,
        MAX_PRICE,
        MODAL_PRICE

      FROM MANDI_PRICES

      WHERE COMMODITY IN (${placeholders})

      ${state ? "AND STATE = ?" : ""}

      AND ARRIVAL_DATE = (
        SELECT MAX(ARRIVAL_DATE)

        FROM MANDI_PRICES

        WHERE COMMODITY IN (${placeholders})

        ${state ? "AND STATE = ?" : ""}
      )

      ORDER BY MODAL_PRICE DESC
    `;

    const latestRows = await executeQuery(
      connection,
      latestQuery,
      state
        ? [
            ...commodities,
            state,
            ...commodities,
            state,
          ]
        : [
            ...commodities,
            ...commodities,
          ]
    );

    // =====================================================
    // 3. SEND RESPONSE
    // =====================================================

    res.status(200).json({
      success: true,

      crop: cropName,

      state: state || "All India",

      summary: {
        latestDate: summary.LATEST_DATE,

        averagePrice: Number(
          summary.AVERAGE_PRICE || 0
        ),

        minimumPrice: Number(
          summary.MIN_PRICE || 0
        ),

        maximumPrice: Number(
          summary.MAX_PRICE || 0
        ),
      },

      latestMarkets: latestRows,
    });
  } catch (error) {
    console.error("❌ Crop Market Intelligence Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current crop market data",
    });
  }
};

// =========================================================
// Export
// =========================================================

const getAvailableStates = async (req, res) => {
  try {
    const connection = await connectSnowflake();

    const query = `
      SELECT DISTINCT STATE
      FROM MANDI_PRICES
      WHERE STATE IS NOT NULL
        AND TRIM(STATE) <> ''
      ORDER BY STATE
    `;

    const rows = await executeQuery(connection, query);

    const states = rows
      .map((row) => row.STATE)
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: states.length,
      states,
    });

  } catch (error) {
    console.error("❌ State Fetch Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch available states",
    });
  }
};




module.exports = {
  getAvailableCrops,
  getAvailableStates,
  getCropPriceTrend,
  CROP_MAPPING,
};