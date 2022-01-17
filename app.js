const express = require("express");
const res = require("express/lib/response");
app = express();

const getCategories = (req, res) => res.status(200).send({ categories: [] });

app.get("/api/categories", getCategories);

module.exports = app;
