const db = require("../db/connection");

exports.selectUsers = () =>
  db.query("SELECT * FROM users").then((result) => result.rows);
