const {
  selectReview,
  amendReview,
  selectAllReviews,
  selectCommentsByReviewId,
  createComment,
  deleteComment,
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
    .catch((err) => next(err));
};

exports.updateReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
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
  selectAllReviews()
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => next(err));
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  createComment(review_id, username, body)
    .then((comment) => res.status(200).send({ comment }))
    .catch((err) => next(err));
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  console.log("in controller", comment_id);
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
