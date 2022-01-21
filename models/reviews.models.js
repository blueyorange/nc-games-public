const db = require("../db/connection");
const format = require("pg-format");
const { rows } = require("pg/lib/defaults");

exports.selectReview = async (review_id) => {
  const comment_count = await db
    .query(`SELECT * FROM comments WHERE review_id=$1`, [review_id])
    .then(({ rows }) => rows.length);
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
    .then((result) => {
      return { ...result.rows[0], comment_count };
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
  let sql = `SELECT * FROM reviews`;
  if (category !== undefined) {
    sql += format(` WHERE category=%L`, category);
  }
  sql += ` ORDER BY ${sort_by} ${order};`;
  console.log(sql);
  return db.query(sql).then((result) => result.rows);
};
