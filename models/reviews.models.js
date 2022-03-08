const db = require("../db/connection");
const format = require("pg-format");

exports.selectReview = (review_id) => {
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

exports.amendReview = (review_id, inc_votes, review_body) => {
  let sql;
  try {
    sql = format(
      `
      UPDATE reviews
      SET votes=votes+%L
      `,
      inc_votes,
      review_body
    );
    if (review_body) {
      sql += format(`, review_body=%L`, review_body);
    }
    sql += format(`WHERE review_id=%L RETURNING *`, review_id);
  } catch (err) {
    console.log(err);
  }
  return db.query(sql).then((result) => result.rows[0]);
};

exports.selectAllReviews = async (sort_by, order, category) => {
  if (category !== undefined) {
    const numCategories = await db
      .query(`SELECT * FROM categories WHERE slug=$1`, [category])
      .then((result) => result.rowCount);
    if (!numCategories) {
      return Promise.reject({ status: 404, msg: "no matching category" });
    }
  }
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
