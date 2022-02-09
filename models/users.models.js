const db = require("../db/connection");

exports.selectUsers = () =>
  db.query("SELECT * FROM users").then((result) => result.rows);

exports.selectUserByUsername = (username) =>
  db.query(`SELECT * FROM users WHERE username=$1`, [username]).then((res) => {
    return res.rows[0];
  });
