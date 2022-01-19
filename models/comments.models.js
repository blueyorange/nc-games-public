const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByReviewId = (review_id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id=$1`, [review_id])
    .then((result) => result.rows);
};

exports.createComment = (review_id, author, body) => {
  const sql = format(
    `INSERT INTO comments (review_id, author, body) VALUES (%L) RETURNING *`,
    [review_id, author, body]
  );
  return db.query(sql).then((result) => result.rows[0]);
};

exports.deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};
