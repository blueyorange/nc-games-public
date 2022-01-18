const { selectReviewById } = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
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
