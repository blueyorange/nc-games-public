const commentRouter = require("express").Router();

const {
  deleteCommentById,
  updateCommentById,
} = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", deleteCommentById);
commentRouter.patch("/:comment_id", updateCommentById);

module.exports = commentRouter;
