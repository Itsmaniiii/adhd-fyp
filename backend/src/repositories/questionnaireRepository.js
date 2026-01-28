import pool from "../db/postgres.js";

export const insertResponses = async (records) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let r of records) {
      await client.query(
        `INSERT INTO questionnaire_response
         (child_id, question, answer)
         VALUES ($1,$2,$3)`,
        [r.child_id, r.question, r.answer]
      );
    }

    await client.query("COMMIT");
    return { message: "Questionnaire submitted successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getQuestionnaireByChild = async (childId) => {
  const result = await pool.query(
    "SELECT * FROM questionnaire_response WHERE child_id=$1",
    [childId]
  );
  return result.rows;
};
