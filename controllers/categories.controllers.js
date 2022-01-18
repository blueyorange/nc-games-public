const { selectCategories } = require("../models/categories.models");

exports.getCategories = async (req, res, next) => {
  const categories = await selectCategories();
  console.log(categories);
  res.status(200).send({ categories });
};
