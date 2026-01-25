import fs from "fs";
import path from "path";
import pool from "./postgres.js";

const initDb = async () => {
  const filePath = path.join(process.cwd(), "sql", "schema.sql");
  const sql = fs.readFileSync(filePath, "utf-8");

  try {
    await pool.query(sql);
    console.log("Tables created from backend");
  } catch (err) {
    console.error("❌ DB init failed:", err.message);
  }
};

export default initDb;
