const axios = require("axios");

const RESOURCE_ID =
  "9ef84268-d588-465a-a308-a864a43d0070";

const BASE_URL =
  `https://api.data.gov.in/resource/${RESOURCE_ID}`;

/* =========================================================
   GET MANDI PRICES
========================================================= */

const getMandiPrices = async ({
  crop,
  mandi,
  state,
  days = 7
} = {}) => {

  const params = {
    "api-key": process.env.DATA_GOV_API_KEY,
    format: "json",
    limit: 10000
  };

  // Filter by crop
  if (crop) {
    params["filters[commodity]"] = crop;
  }

  // Filter by mandi
  if (mandi) {
    params["filters[market]"] = mandi;
  }

  // Filter by state
  if (state) {
    params["filters[state]"] = state;
  }

  const response = await axios.get(BASE_URL, {
    params
  });

  let records = response.data.records || [];

  /* -------------------------------------------------------
     DATE RANGE
  ------------------------------------------------------- */

  const numberOfDays = Number(days) || 7;

  const today = new Date();

  // Remove time component
  today.setHours(23, 59, 59, 999);

  const startDate = new Date(today);

  startDate.setDate(
    today.getDate() - numberOfDays + 1
  );

  startDate.setHours(0, 0, 0, 0);

  /* -------------------------------------------------------
     FILTER RECORDS BY DATE
  ------------------------------------------------------- */

  records = records.filter((item) => {

    if (!item.arrival_date) {
      return false;
    }

    const [day, month, year] =
      item.arrival_date.split("/").map(Number);

    const arrivalDate = new Date(
      year,
      month - 1,
      day
    );

    return (
      arrivalDate >= startDate &&
      arrivalDate <= today
    );
  });

  /* -------------------------------------------------------
     GROUP RECORDS BY DATE
  ------------------------------------------------------- */

  const groupedByDate = {};

  records.forEach((item) => {

    const date = item.arrival_date;

    const modalPrice = Number(
      item.modal_price
    );

    const minPrice = Number(
      item.min_price
    );

    const maxPrice = Number(
      item.max_price
    );

    // Ignore invalid records
    if (
      !date ||
      Number.isNaN(modalPrice)
    ) {
      return;
    }

    if (!groupedByDate[date]) {

      groupedByDate[date] = {
        modalPrices: [],
        minPrices: [],
        maxPrices: []
      };
    }

    groupedByDate[date].modalPrices.push(
      modalPrice
    );

    if (!Number.isNaN(minPrice)) {
      groupedByDate[date].minPrices.push(
        minPrice
      );
    }

    if (!Number.isNaN(maxPrice)) {
      groupedByDate[date].maxPrices.push(
        maxPrice
      );
    }
  });

  /* -------------------------------------------------------
     CREATE DAILY PRICE DATA
  ------------------------------------------------------- */

  const dailyPrices = Object.entries(
    groupedByDate
  )
    .map(([date, values]) => {

      const modalAverage =
        values.modalPrices.reduce(
          (sum, price) => sum + price,
          0
        ) / values.modalPrices.length;

      const dailyMin =
        values.minPrices.length > 0
          ? Math.min(...values.minPrices)
          : modalAverage;

      const dailyMax =
        values.maxPrices.length > 0
          ? Math.max(...values.maxPrices)
          : modalAverage;

      return {
        arrival_date: date,

        modal_price: Number(
          modalAverage.toFixed(2)
        ),

        min_price: Number(
          dailyMin.toFixed(2)
        ),

        max_price: Number(
          dailyMax.toFixed(2)
        )
      };
    })
    .sort((a, b) => {

      const [dayA, monthA, yearA] =
        a.arrival_date
          .split("/")
          .map(Number);

      const [dayB, monthB, yearB] =
        b.arrival_date
          .split("/")
          .map(Number);

      return (
        new Date(
          yearA,
          monthA - 1,
          dayA
        ) -
        new Date(
          yearB,
          monthB - 1,
          dayB
        )
      );
    });

  return dailyPrices;
};


/* =========================================================
   GET CROP LIST
========================================================= */

const getCrops = async () => {

  const response = await axios.get(
    BASE_URL,
    {
      params: {
        "api-key":
          process.env.DATA_GOV_API_KEY,

        format: "json",

        limit: 10000
      }
    }
  );

  const records =
    response.data.records || [];

  const crops = [
    ...new Set(
      records
        .map(
          (item) => item.commodity
        )
        .filter(Boolean)
    )
  ];

  return crops.sort();
};


/* =========================================================
   GET MANDI LIST
========================================================= */

const getMandis = async ({
  state,
  crop
} = {}) => {

  const response = await axios.get(
    BASE_URL,
    {
      params: {
        "api-key":
          process.env.DATA_GOV_API_KEY,

        format: "json",

        limit: 10000
      }
    }
  );

  let records =
    response.data.records || [];

  /* -------------------------------------------------------
     FILTER STATE
  ------------------------------------------------------- */

  if (state) {

    records = records.filter(
      (item) =>
        item.state?.toLowerCase() ===
        state.toLowerCase()
    );
  }

  /* -------------------------------------------------------
     FILTER CROP
  ------------------------------------------------------- */

  if (crop) {

    records = records.filter(
      (item) =>
        item.commodity?.toLowerCase() ===
        crop.toLowerCase()
    );
  }

  /* -------------------------------------------------------
     UNIQUE MANDIS
  ------------------------------------------------------- */

  const mandis = [
    ...new Set(
      records
        .map(
          (item) => item.market
        )
        .filter(Boolean)
    )
  ];

  return mandis.sort();
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  getMandiPrices,
  getCrops,
  getMandis
};