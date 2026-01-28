import fs from "fs";
import path from "path";
import pool from "./postgres.js";

const initDb = async () => {
  try {
    const sqlFolder = path.join(process.cwd(), "sql");
    const files = fs.readdirSync(sqlFolder)
      .filter(file => file.endsWith(".sql"))
      .sort(); // sort to maintain order if needed

    for (const file of files) {
      const sql = fs.readFileSync(path.join(sqlFolder, file), "utf-8");
      await pool.query(sql);
    }
    console.log("DB Connected ✅");
  } catch (err) {
    console.error("❌ DB init failed:", err.message);
  }
};

export default initDb;
