const {
  selectReview,
  amendReview,
  selectAllReviews,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => {
      if (review === undefined) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const inc_votes = req.body.inc_votes ? req.body.inc_votes : 0;
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
  if (order === undefined) order = "DESC";
  if (!["asc", "desc"].includes(order.toLowerCase())) {
    return next({
      status: 400,
      msg: "bad order by query",
    });
  }
  if (sort_by === undefined) sort_by = "created_at";
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
      msg: "bad sort by query",
    });
  }
  selectAllReviews(sort_by, order, category)
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => next(err));
};
