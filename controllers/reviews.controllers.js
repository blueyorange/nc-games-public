const {
  selectReview,
  amendReview,
  selectAllReviews,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => {
      // review = {comment_count:0} for review not found
      if (review.review_id === undefined) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch((err) => next(err));
};

exports.updateReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined || Object.keys(req.body).length !== 1) {
    return next({ status: 400, msg: "invalid field" });
  }
  amendReview(review_id, inc_votes)
    .then((review) => {
      if (review === undefined) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch((err) => next(err));
};

exports.getAllReviews = (req, res, next) => {
  let { sort_by, order, category } = req.query;
  if (order === undefined) order = "ASC";
  if (!["asc", "desc"].includes(order.toLowerCase())) {
    next({ status: 400, msg: "bad query: order_by incorrect query syntax" });
  }
  console.log("in the controller");
  if (sort_by === undefined) sort_by = "title";
  const columns = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];
  if (!columns.includes(sort_by)) {
    next({
      status: 400,
      msg: "bad query: sort_by does not match existing column",
    });
  }
  selectAllReviews(sort_by, order, category)
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => next(err));
};
