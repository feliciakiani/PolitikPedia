require('dotenv').config();

const mysql = require('mysql2/promise'); 

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  authPlugins: {
    gcp: {
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
  }
});

// Export the pool for use in other files
module.exports = pool;
