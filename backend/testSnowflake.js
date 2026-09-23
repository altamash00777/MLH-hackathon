require("dotenv").config();
const snowflake = require("snowflake-sdk");

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
});

connection.connect((err, conn) => {
  if (err) {
    console.error("❌ Snowflake connection failed:");
    console.error(err.message);
    return;
  }

  console.log("✅ Snowflake connected!");

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
    "Uttar Pradesh",
    "Lucknow",
    "Lucknow APMC",
    "Rice",
    "Common",
    "FAQ",
    "2026-09-23",
    3000,
    3500,
    3250
  ];

  conn.execute({
    sqlText: sql,
    binds: binds,

    complete: (err, stmt, rows) => {
      if (err) {
        console.error("❌ Insert failed:");
        console.error(err.message);
        connection.destroy();
        return;
      }

      console.log("✅ Mandi record inserted successfully!");

      conn.execute({
        sqlText: `
          SELECT *
          FROM MANDI_PRICES
          ORDER BY ARRIVAL_DATE DESC
        `,

        complete: (err, stmt, rows) => {
          if (err) {
            console.error("❌ Select failed:");
            console.error(err.message);
          } else {
            console.log("📊 Snowflake data:");
            console.table(rows);
          }

          connection.destroy(() => {
            console.log("✅ Connection closed.");
          });
        }
      });
    }
  });
});