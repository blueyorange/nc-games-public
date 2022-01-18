const { selectReview, amendReview } = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => {
      if (review === undefined) {
        console.log("NOT FOUND");
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch((err) => next(err));
};

exports.updateReviewById = (req, res, next) => {
  const { review_id } = req.params;
  amendReview(review_id, req.body)
    .then((review) => {
      if (review === undefined) {
        console.log("NOT FOUND");
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch((err) => next(err));
};
