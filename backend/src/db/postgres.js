import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // --- Nayi Configuration ---
  max: 20,              // Limit barha kar 20 kar di
  idleTimeoutMillis: 5000, // 5 seconds idle rehne pe connection khatam kar do
  connectionTimeoutMillis: 2000,
});

// Ye check karne ke liye ke connection ban raha hai
pool.on('connect', () => {
  console.log("🟢 New DB connection created");
});

export default pool;