const db = require("../db/connection");

exports.selectCategories = async () =>
  db.query("SELECT * FROM categories").then((result) => result.rows);
