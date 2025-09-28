const pool = require("../config/dbConnection");

exports.createUrl = async (originalUrl, shortCode, userId) => {
  try {
    const result = await pool.query(
      `
            INSERT INTO urls(original_url,short_code,user_id)
            VALUES ($1,$2,$3)
            RETURNING id, original_url, short_code, created_at
            `,
      [originalUrl, shortCode, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getUrlByShortCode = async (shortCode) => {
  try {
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_code = $1",
      [shortCode]
    );
    console.log(result);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getUrlsByUser = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.deleteUrl = async (id, userId) => {
  try {
    const result = await pool.query(
      "DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    );
    return result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};
