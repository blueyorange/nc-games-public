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
