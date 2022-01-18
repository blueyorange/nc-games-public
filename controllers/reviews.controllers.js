const { selectReviewById } = require("../models/reviews.models");

exports.getReviewById = async (req, res, next) => {
  const { review_id } = req.params;
  const review = await selectReviewById(review_id);
  res.status(200).send({ review });
};
