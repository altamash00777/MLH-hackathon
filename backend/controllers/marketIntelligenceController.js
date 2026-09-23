const {
  connectSnowflake,
  executeQuery,
} = require("../config/snowflake");

// =========================================================
// CROP MAPPING
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

  Bajra: [
    "Bajra(Pearl Millet/Cumbu)",
  ],

  Groundnut: [
    "Groundnut",
    "Groundnut pods(raw)",
    "Groundnut(Split)",
  ],
};


// =========================================================
// GET AVAILABLE CROPS
// GET /api/market-intelligence/crops
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

    console.error("❌ Market Intelligence Crop Error:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch available crops",
    });
  }
};


// =========================================================
// GET AVAILABLE STATES
// GET /api/market-intelligence/states
// =========================================================

const getAvailableStates = async (req, res) => {
  let connection;

  try {

    connection = await connectSnowflake();

    const query = `
      SELECT DISTINCT
        TRIM(STATE) AS STATE
      FROM MANDI_PRICES
      WHERE STATE IS NOT NULL
        AND TRIM(STATE) <> ''
      ORDER BY STATE
    `;

    const rows = await executeQuery(
      connection,
      query
    );

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


// =========================================================
// GET CROP MARKET INTELLIGENCE
//
// GET /api/market-intelligence/trend/:crop
//
// Optional:
// ?state=Uttar Pradesh
// =========================================================

const getCropPriceTrend = async (req, res) => {

  let connection;

  try {

    const { crop } = req.params;
    const { state } = req.query;


    // =====================================================
    // VALIDATE CROP
    // =====================================================

    if (!crop) {

      return res.status(400).json({
        success: false,
        message: "Crop is required",
      });

    }


    // =====================================================
    // FIND CROP
    // =====================================================

    const cropName = Object.keys(CROP_MAPPING).find(
      (name) =>
        name.toLowerCase() === crop.toLowerCase()
    );


    if (!cropName) {

      return res.status(404).json({
        success: false,
        message: "Crop not supported",
      });

    }


    const commodities = CROP_MAPPING[cropName];


    // =====================================================
    // CONNECT TO SNOWFLAKE
    // =====================================================

    connection = await connectSnowflake();


    // =====================================================
    // CREATE SQL PLACEHOLDERS
    // =====================================================

    const placeholders = commodities
      .map(() => "?")
      .join(", ");


    // =====================================================
    // LATEST MARKET DATA
    //
    // IMPORTANT:
    //
    // We DON'T use:
    //
    // ARRIVAL_DATE = MAX(ARRIVAL_DATE)
    //
    // because that removes markets whose latest
    // available data is from another date.
    //
    // Instead, ROW_NUMBER() gets the latest record
    // independently for every:
    //
    // STATE + DISTRICT + MARKET + COMMODITY
    // + VARIETY + GRADE
    //
    // This preserves multiple varieties.
    // =====================================================

    const latestMarketsQuery = `
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

      ${
        state
          ? `
            AND UPPER(TRIM(STATE))
                = UPPER(TRIM(?))
          `
          : ""
      }

      QUALIFY ROW_NUMBER() OVER (
        PARTITION BY
          STATE,
          DISTRICT,
          MARKET,
          COMMODITY,
          VARIETY,
          GRADE

        ORDER BY
          ARRIVAL_DATE DESC
      ) = 1

      ORDER BY
        MODAL_PRICE DESC
    `;


    const latestMarkets = await executeQuery(
      connection,
      latestMarketsQuery,
      state
        ? [
            ...commodities,
            state,
          ]
        : commodities
    );


    // =====================================================
    // SUMMARY
    //
    // IMPORTANT:
    //
    // Summary is also calculated ONLY from the latest
    // available record of each market/variety/grade.
    //
    // So summary and table now use the same data.
    // =====================================================

    const summaryQuery = `
      SELECT

        MAX(ARRIVAL_DATE)
          AS LATEST_DATE,

        AVG(MODAL_PRICE)
          AS AVERAGE_PRICE,

        MIN(MODAL_PRICE)
          AS MIN_PRICE,

        MAX(MODAL_PRICE)
          AS MAX_PRICE

      FROM (

        SELECT
          STATE,
          DISTRICT,
          MARKET,
          COMMODITY,
          VARIETY,
          GRADE,
          ARRIVAL_DATE,
          MODAL_PRICE

        FROM MANDI_PRICES

        WHERE COMMODITY IN (${placeholders})

        ${
          state
            ? `
              AND UPPER(TRIM(STATE))
                  = UPPER(TRIM(?))
            `
            : ""
        }

        QUALIFY ROW_NUMBER() OVER (
          PARTITION BY
            STATE,
            DISTRICT,
            MARKET,
            COMMODITY,
            VARIETY,
            GRADE

          ORDER BY
            ARRIVAL_DATE DESC
        ) = 1

      ) latest_data
    `;


    const summaryRows = await executeQuery(
      connection,
      summaryQuery,
      state
        ? [
            ...commodities,
            state,
          ]
        : commodities
    );


    const summary = summaryRows[0] || {};


    // =====================================================
    // FORMAT SUMMARY
    // =====================================================

    const latestDate =
      summary.LATEST_DATE || null;

    const averagePrice =
      Number(summary.AVERAGE_PRICE || 0);

    const minimumPrice =
      Number(summary.MIN_PRICE || 0);

    const maximumPrice =
      Number(summary.MAX_PRICE || 0);


    // =====================================================
    // RESPONSE
    // =====================================================

    res.status(200).json({

      success: true,

      crop: cropName,

      state: state || "All India",

      summary: {

        latestDate,

        averagePrice,

        minimumPrice,

        maximumPrice,

      },

      latestMarkets,

    });


  } catch (error) {

    console.error(
      "❌ Crop Market Intelligence Error:"
    );

    console.error(error.message);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch current crop market data",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,

    });

  }

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  getAvailableCrops,

  getAvailableStates,

  getCropPriceTrend,

  CROP_MAPPING,

};