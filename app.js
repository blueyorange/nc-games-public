const express = require("express");
const res = require("express/lib/response");
app = express();

const { getCategories } = require("./controllers/categories.controllers");

app.get("/api/categories", getCategories);

module.exports = app;
