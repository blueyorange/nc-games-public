const { formatData } = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/");
require("jest");

const { userData } = testData;
console.log(userData);
console.log(formatData(userData));

describe("formatData", () => {
  it("should take an array of objects and return as an array of arrays of values", () => {});
});
