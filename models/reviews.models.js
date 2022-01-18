const db = require("../db/connection");
const format = require("pg-format");

exports.selectReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
    .then((result) => result.rows[0]);
};

exports.amendReview = (review_id, data) => {
  console.log("in model", data);
  const allowedFields = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "votes",
  ];
  const definedFields = allowedFields.filter(
    (field) => data[field] !== undefined
  );
  console.log(definedFields);
  console.log(format(`title=%L`, data["title"]));
  const sql =
    "UPDATE reviews SET " +
    definedFields
      .reduce((output, field) => {
        let string = output + format(`%I=%L, `, field, data[field]);
        console.log(string);
        return string;
      }, "")
      .slice(0, -2) +
    format(` WHERE review_id=%L RETURNING *;`, review_id);

  console.log(sql);
  return db.query(sql).then((result) => result.rows[0]);
};
