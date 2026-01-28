import pool from "../db/postgres.js";

export const addGenetics = async (data) => {
  const query = `
    INSERT INTO genetic_history
    (child_id, parent_speech_delay, parent_attention_issue, sibling_delay, premature_birth)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `;

  const values = [
    data.child_id,
    data.parent_speech_delay,
    data.parent_attention_issue,
    data.sibling_delay,
    data.premature_birth
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getGeneticsByChild = async (childId) => {
  const result = await pool.query(
    "SELECT * FROM genetic_history WHERE child_id=$1",
    [childId]
  );
  return result.rows;
};
