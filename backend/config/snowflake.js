const snowflake = require("snowflake-sdk");

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

function connectSnowflake() {
  return new Promise((resolve, reject) => {
    const connection = createSnowflakeConnection();

    connection.connect((err, conn) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("✅ Snowflake connected");

      resolve(conn);
    });
  });
}

// =========================================================
// Execute Query
// =========================================================

function executeQuery(conn, sqlText, binds = []) {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,

      complete: (err, stmt, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      },
    });
  });
}

// =========================================================
// Export
// =========================================================

module.exports = {
  connectSnowflake,
  executeQuery,
};