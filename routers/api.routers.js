const apiRouter = require("express").Router();
const reviewRouter = require("./reviews.routers");
const commentRouter = require("./comments.routers");
const categoryRouter = require("./categories.routers");
const userRouter = require("./users.routers");
const fs = require("fs/promises");

apiRouter.get("/", (_, res, next) => {
  const path = `${__dirname}/../endpoints.json`;
  fs.readFile(path, "utf-8")
    .then((contents) => {
      const endpoints = JSON.parse(contents);
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      next(err);
    });
});
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
