const reviewRouter = require("express").Router();
const {
  getReviewById,
  updateReviewById,
  getAllReviews,
} = require("../controllers/reviews.controllers");

const commentRouter = require("./comments.routers.js");

reviewRouter.use("/:review_id/comments", commentRouter);
reviewRouter.get("/:review_id", getReviewById, commentRouter);
reviewRouter.patch("/:review_id", updateReviewById);
reviewRouter.get("/", getAllReviews);

module.exports = reviewRouter;
