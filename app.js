const express = require("express");
app = express();
const apiRouter = require("./routers/api.routers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handle404errors,
} = require("./errors.js");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.all("*", (req, res) => {
  res.status(400).send({ msg: "invalid endpoint" });
});
app.use(handle404errors);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
