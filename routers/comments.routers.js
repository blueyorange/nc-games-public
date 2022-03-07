const commentRouter = require("express").Router({ mergeParams: true });

const {
  deleteCommentById,
  updateCommentById,
  postComment,
  getCommentsByReviewId,
} = require("../controllers/comments.controllers");

commentRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(updateCommentById);
commentRouter.post("/", postComment);
commentRouter.get("/", getCommentsByReviewId);

module.exports = commentRouter;
