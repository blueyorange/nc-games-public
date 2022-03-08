const format = require("pg-format");
const db = require("../db/connection");

exports.selectUsers = () =>
  db.query("SELECT * FROM users").then((result) => result.rows);

exports.selectUserByUsername = async (username) => {
  const reviews = await db
    .query(`SELECT * FROM reviews WHERE owner=$1`, [username])
    .then((result) => result.rows);

  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return undefined;
      }
      const user = { ...result.rows[0], reviews };
      return user;
    });
};

exports.amendUser = (username, data) => {
  let sql = `
  UPDATE users
  SET `;
  for (const key in data) {
    const value = data[key];
    if (value) {
      sql += format(`%I=%L,`, key, value);
    }
  }
  sql = sql.slice(0, -1);
  sql += format(" WHERE username=%L RETURNING *", username);
  return db.query(sql).then((result) => result.rows[0]);
};
