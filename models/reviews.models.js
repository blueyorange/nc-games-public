const db = require("../db/connection");
const format = require("pg-format");
const { rows } = require("pg/lib/defaults");

exports.selectReview = async (review_id) => {
  return db
    .query(
      `
      SELECT *, (
        SELECT COUNT(*)::int FROM comments WHERE comments.review_id=reviews.review_id
        )
        AS comment_count
      FROM reviews 
      WHERE review_id=$1;
      `,
      [review_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.amendReview = (review_id, inc_votes) => {
  const sql = format(
    `UPDATE reviews SET votes=votes+%L WHERE review_id=%L RETURNING *`,
    inc_votes,
    review_id
  );
  return db.query(sql).then((result) => result.rows[0]);
};

exports.selectAllReviews = (sort_by, order, category) => {
  let sql = `SELECT *, (
    SELECT COUNT(*)::int FROM comments WHERE comments.review_id=reviews.review_id
    )
    AS comment_count
    FROM reviews`;
  if (category !== undefined) {
    sql += format(` WHERE category=%L`, category);
  }
  sql += ` ORDER BY ${sort_by} ${order};`;
  return db.query(sql).then((result) => result.rows);
};
