const express = require("express");
const res = require("express/lib/response");
app = express();

const { getCategories } = require("./controllers/categories.controllers");
const { getReviewById } = require("./controllers/reviews.controllers");

app.get("/api/categories", getCategories);

//app.get("/api/reviews/:review_id", getReviewById);

module.exports = app;
