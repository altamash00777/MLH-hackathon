require("dotenv").config();

const https = require("https");
const snowflake = require("snowflake-sdk");

const API_KEY = process.env.MANDI_API_KEY;

const CROPS = [
  "Rice",
  "Wheat",
  "Potato",
  "Onion",
  "Tomato",
  "Maize",
  "Soyabean",
  "Mustard",
  "Gram",
  "Arhar",
  "Bajra",
  "Groundnut",
];

const RESOURCE_ID =
  "9ef84268-d588-465a-a308-a864a43d0070";

// =========================================================
// Convert DD/MM/YYYY → YYYY-MM-DD
// =========================================================

function convertDate(dateString) {
  if (!dateString) return null;

  const [day, month, year] = dateString.split("/");

  return `${year}-${month}-${day}`;
}

// =========================================================
// Fetch Mandi Data for One Crop
// =========================================================

function fetchMandiData(crop) {
  return new Promise((resolve, reject) => {
    const API_URL =
      `https://api.data.gov.in/resource/${RESOURCE_ID}` +
      `?api-key=${API_KEY}` +
      `&format=json` +
      `&filters%5Bcommodity%5D=${encodeURIComponent(crop)}` +
      `&limit=100`;

    https
      .get(API_URL, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const result = JSON.parse(data);

            if (result.status !== "ok") {
              reject(
                new Error(
                  `API error for ${crop}: ${result.error || "Unknown error"}`
                )
              );
              return;
            }

            resolve(result.records || []);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

// =========================================================
// Create Snowflake Connection
// =========================================================

function createSnowflakeConnection() {
  return snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
  });
}

// =========================================================
// Connect to Snowflake
// =========================================================

function connectSnowflake(connection) {
  return new Promise((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(conn);
    });
  });
}

// =========================================================
// Insert One Record
// =========================================================

function insertRecord(connection, record) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO MANDI_PRICES
      (
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
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const binds = [
      record.state,
      record.district,
      record.market,
      record.commodity,
      record.variety,
      record.grade,
      convertDate(record.arrival_date),
      Number(record.min_price),
      Number(record.max_price),
      Number(record.modal_price),
    ];

    connection.execute({
      sqlText: sql,
      binds,

      complete: (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      },
    });
  });
}

// =========================================================
// Main
// =========================================================

async function main() {
  let connection = null;

  try {
    console.log("🌾 Starting multi-crop mandi data import...");
    console.log(`📋 Crops to import: ${CROPS.length}`);
    console.log("");

    // -----------------------------------------------------
    // Connect to Snowflake ONCE
    // -----------------------------------------------------

    console.log("🔌 Connecting to Snowflake...");

    connection = createSnowflakeConnection();

    const conn = await connectSnowflake(connection);

    console.log("✅ Connected to Snowflake");
    console.log("");

    let totalSuccessful = 0;
    let totalFailed = 0;

    // -----------------------------------------------------
    // Process crops ONE BY ONE
    // -----------------------------------------------------

    for (const crop of CROPS) {
      console.log("========================================");
      console.log(`🌾 Processing: ${crop}`);
      console.log("========================================");

      try {
        // Fetch data for crop
        const records = await fetchMandiData(crop);

        console.log(`📡 Received ${records.length} records for ${crop}`);

        let successful = 0;
        let failed = 0;

        // Insert records ONE BY ONE
        for (let i = 0; i < records.length; i++) {
          const record = records[i];

          try {
            await insertRecord(conn, record);

            successful++;
            totalSuccessful++;

            console.log(
              `✓ ${i + 1}/${records.length} - ${record.market}`
            );
          } catch (error) {
            failed++;
            totalFailed++;

            console.error(
              `❌ ${i + 1}/${records.length} - ${record.market}`
            );

            console.error(`   ${error.message}`);
          }
        }

        console.log("");
        console.log(`✅ ${crop} completed`);
        console.log(`   Successful: ${successful}`);
        console.log(`   Failed: ${failed}`);
        console.log("");
      } catch (error) {
        console.error(`❌ Could not process ${crop}`);
        console.error(`   ${error.message}`);
        console.log("");
      }
    }

    // -----------------------------------------------------
    // Final Summary
    // -----------------------------------------------------

    console.log("========================================");
    console.log("🎉 MULTI-CROP IMPORT COMPLETED");
    console.log("========================================");
    console.log(`🌾 Crops processed: ${CROPS.length}`);
    console.log(`✅ Total successful: ${totalSuccessful}`);
    console.log(`❌ Total failed: ${totalFailed}`);
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error("❌ Import failed:");
    console.error(error.message);
  } finally {
    // -----------------------------------------------------
    // Always close Snowflake connection
    // -----------------------------------------------------

    if (connection) {
      connection.destroy((err) => {
        if (err) {
          console.error("❌ Connection close error:");
          console.error(err.message);
        } else {
          console.log("🔌 Snowflake connection closed.");
        }
      });
    }
  }
}

main();