const pool = require("../config/dbConnection");

exports.createUser = async (name, email, password) => {
  try {
    const result = await pool.query(
      `   INSERT INTO users(name,email,password) 
        VALUES ($1,$2,$3)
        RETURNING id,name,email,created_at
    `,
      [name, email, password]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.getUserById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at , password_changed_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.setResetCode = async (resetCode, expireTime, userId) => {
  try {
    const ReturnedResetCode = await pool.query(
      `
      UPDATE users 
      SET password_reset_token = $1 , password_reset_expires = $2
      where id = $3 
      RETURNING password_reset_token
      `,
      [resetCode, new Date(expireTime), userId]
    );
    return ReturnedResetCode;
  } catch (error) {
    throw error;
  }
};

exports.getUserByResetToken = async (hashedToken) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE password_reset_token = $1 
       AND password_reset_expires > now()`,
      [hashedToken]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = async (userId, hashedPassword) => {
  try {
    await pool.query(
      `UPDATE users 
       SET password = $1, password_reset_token = NULL, password_reset_expires = NULL, password_changed_at = now()
       WHERE id = $2`,
      [hashedPassword, userId]
    );
  } catch (error) {
    throw error;
  }
};
