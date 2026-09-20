require("dotenv").config();

const { getMandiPrices } = require("./services/mandiService");

getMandiPrices()
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((error) => {
    console.error("Mandi API Error:");

    console.error(
      error.response?.data || error.message
    );
  });