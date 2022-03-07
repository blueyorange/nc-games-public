const reviewRouter = require("express").Router();
const {
  getReviewById,
  updateReviewById,
  getAllReviews,
} = require("../controllers/reviews.controllers");

const commentRouter = require("./comments.routers.js");

reviewRouter.use("/:review_id/comments", commentRouter);
reviewRouter.route("/:review_id").get(getReviewById).patch(updateReviewById);
reviewRouter.get("/", getAllReviews);

module.exports = reviewRouter;
