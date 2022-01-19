const apiRouter = require("express").Router();
const reviewRouter = require("./reviews.routers");
const commentRouter = require("./comments.routers");
const categoryRouter = require("./categories.routers");

apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/categories", categoryRouter);

module.exports = apiRouter;
