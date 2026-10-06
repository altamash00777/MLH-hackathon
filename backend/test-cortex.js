require("dotenv").config();

const { getCortexResponse } = require("./services/cortexService");

async function testCortex() {
  try {
    const response = await getCortexResponse(
      "Hello DISHA, explain how you help farmers in simple words."
    );

    console.log("\nCORTEX RESPONSE:");
    console.log(response);
  } catch (error) {
    console.error("\nCORTEX TEST FAILED");
    console.error(error);
  }
}

testCortex();