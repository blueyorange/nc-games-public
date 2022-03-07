const commentRouter = require("express").Router({ mergeParams: true });

const {
  deleteCommentById,
  updateCommentById,
  postComment,
  getCommentsByReviewId,
} = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", deleteCommentById);
commentRouter.patch("/:comment_id", updateCommentById);
commentRouter.post("/", postComment);
commentRouter.get("/", getCommentsByReviewId);

module.exports = commentRouter;
