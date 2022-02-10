const {
  selectCommentsByReviewId,
  createComment,
  deleteComment,
  amendComment,
} = require("../models/comments.models");

exports.getCommentsByReviewId = async (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
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
  deleteComment(comment_id)
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        res.status(204).send();
      }
    })
    .catch((err) => next(err));
};

exports.updateCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  // increase vote by 1 if no inc given
  const inc_votes = req.body.inc_votes ? req.body.inc_votes : 1;
  amendComment(comment_id, inc_votes)
    .then((comment) => {
      if (comment === undefined) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ comment });
      }
    })
    .catch((err) => next(err));
};
