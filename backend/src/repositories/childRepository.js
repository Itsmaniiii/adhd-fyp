import pool from "../db/postgres.js";

export const createChild = async (data) => {
  const query = `
    INSERT INTO child_profile
    (user_id, name, age_months, gender, weight, height)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `;

  const values = [
    data.user_id,  // from JWT
    data.name,
    data.age_months,
    data.gender,
    data.weight,
    data.height
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getChildByUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM child_profile WHERE user_id=$1",
    [userId]
  );
  return result.rows;
};
