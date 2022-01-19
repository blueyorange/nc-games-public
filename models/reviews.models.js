const db = require("../db/connection");
const format = require("pg-format");

exports.selectReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
    .then((result) => result.rows[0]);
};

exports.amendReview = (review_id, data) => {
  const allowedFields = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "votes",
  ];
  for (let key in data) {
    if (!allowedFields.includes(key)) {
      return Promise.reject({ status: 400, msg: "field not allowed" });
    }
  }
  // filter out non-empty fields
  const definedFields = allowedFields.filter(
    (field) => data[field] !== undefined
  );
  // create query sql
  const sql =
    "UPDATE reviews SET " +
    definedFields
      .reduce(
        (output, field) => output + format(`%I=%L, `, field, data[field]),
        ""
      )
      .slice(0, -2) +
    format(` WHERE review_id=%L RETURNING *;`, review_id);
  return db.query(sql).then((result) => result.rows[0]);
};
