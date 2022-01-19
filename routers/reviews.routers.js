const reviewRouter = require("express").Router();
const {
  getReviewById,
  updateReviewById,
  getAllReviews,
} = require("../controllers/reviews.controllers");

const {
  postComment,
  getCommentsByReviewId,
} = require("../controllers/comments.controllers");

reviewRouter.post("/:review_id/comments", postComment);
reviewRouter.get("/:review_id", getReviewById);
reviewRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewRouter.patch("/:review_id", updateReviewById);
reviewRouter.get("/", getAllReviews);

module.exports = reviewRouter;
