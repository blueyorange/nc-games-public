const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByReviewId = async (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "non-existant review id" });
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT comments.*,users.avatar_url 
        FROM comments 
        LEFT JOIN users ON comments.author=users.username
        WHERE review_id=$1`,
          [review_id]
        )
        .then((result) => {
          return result.rows;
        });
    });
};

exports.createComment = (review_id, author, body) => {
  const sql = format(
    `INSERT INTO comments (review_id, author, body) VALUES (%L);`,
    [review_id, author, body],
    review_id
  );
  return db.query(sql).then(() => {
    return exports.selectCommentsByReviewId(review_id);
  });
};

exports.deleteComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]);
};

exports.amendComment = (comment_id, inc_votes, body) => {
  let sql;
  if (body) {
    sql = format(
      `UPDATE comments SET votes=votes+%L, body=%L WHERE comment_id=%L RETURNING *`,
      inc_votes,
      body,
      comment_id
    );
  } else {
    sql = format(
      `UPDATE comments SET votes=votes+%L WHERE comment_id=%L RETURNING *`,
      inc_votes,
      comment_id
    );
  }
  return db.query(sql).then((result) => result.rows[0]);
};
