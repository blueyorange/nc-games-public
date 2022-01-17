const {
  dropTables,
  createTables,
  insertDataIntoTable,
} = require("./seed-helpers");

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  const tableNamesInDropOrder = ["comments", "reviews", "users", "categories"];
  await dropTables(tableNamesInDropOrder);
  const tableNamesInCreateOrder = tableNamesInDropOrder.reverse();
  await createTables(tableNamesInCreateOrder);
  await insertDataIntoTable(categoryData, "categories");
  await insertDataIntoTable(userData, "users");
  await insertDataIntoTable(reviewData, "reviews");
  await insertDataIntoTable(commentData, "comments");
};

module.exports = seed;
