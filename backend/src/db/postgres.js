import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: [".env", ".env.local"] });
const { Pool } = pkg;

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD || "your_password"),
  database: process.env.DB_NAME || "adhd_fyp",
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

// Ye check karne ke liye ke connection ban raha hai
pool.on('connect', () => {
  console.log("🟢 New DB connection created");
});

pool.on('error', (err) => {
  console.error("❌ Unexpected DB pool error:", err);
});

export default pool;