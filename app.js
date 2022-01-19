const express = require("express");
const res = require("express/lib/response");
app = express();

const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviewById,
  updateReviewById,
  getAllReviews,
} = require("./controllers/reviews.controllers");

app.use(express.json());
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", updateReviewById);
app.get("/api/reviews/", getAllReviews);

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
