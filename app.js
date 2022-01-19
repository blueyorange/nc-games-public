const express = require("express");
app = express();
const apiRouter = require("./routers/api.routers");

app.use(express.json());
app.use("/api", apiRouter);
app.all("*", (req, res) => {
  res.status(400).send({ msg: "invalid endpoint" });
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: err.detail });
  }
  next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request: invalid id" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  }
  next();
});

module.exports = app;
