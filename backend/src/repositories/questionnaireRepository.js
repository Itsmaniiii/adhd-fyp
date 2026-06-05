import pool from "../db/postgres.js";

export const insertResponses = async (records) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertPromises = records.map(r =>
      client.query(
        `INSERT INTO questionnaire_response
         (user_id, question, answer, score)
         VALUES ($1, $2, $3, $4)`,
        [r.user_id, r.question, r.answer, r.score]
      )
    );

    await Promise.all(insertPromises);

    await client.query("COMMIT");
    return {
      message: "Questionnaire submitted successfully",
      count: records.length
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error(`Database error: ${err.message}`);
  } finally {
    client.release();
  }
};

export const getQuestionnaireByUser = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM questionnaire_response WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
};
