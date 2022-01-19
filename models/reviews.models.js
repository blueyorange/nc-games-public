const db = require("../db/connection");
const format = require("pg-format");

exports.selectReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
    .then((result) => result.rows[0]);
};

exports.amendReview = (review_id, inc_votes) => {
  // if (inc_votes === undefined) {
  //   return Promise.reject({ status: 400, msg: "invalid field" });
  // }
  const sql = format(
    `UPDATE reviews SET votes=votes+%L WHERE review_id=%L RETURNING *`,
    inc_votes,
    review_id
  );
  return db.query(sql).then((result) => result.rows[0]);
};

exports.selectAllReviews = () => {
  return db.query(`SELECT * FROM reviews`).then((result) => result.rows);
};
