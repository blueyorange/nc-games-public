const db = require("../db/connection");

exports.selectReviewById = async (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
    .then((result) => result.rows[0]);
};
