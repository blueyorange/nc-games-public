const db = require("../db/connection");

exports.selectReviewById = async (review_id) => {
  db.query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id]);
};
