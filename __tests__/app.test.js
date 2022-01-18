const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const { idleTimeoutMillis } = require("pg/lib/defaults");
const { get } = require("express/lib/response");

beforeEach(() => seed(testData));
afterAll(() => db.end());

const { categoryData, reviewData, commentData, userData } = testData;

describe("GET /api/categories", () => {
  it("responds with an array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toBeInstanceOf(Array);
      });
  });
  it("matches the test data", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toEqual(categoryData);
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("responds with an object", () => {
    return request(app)
      .get("/api//reviews/1")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Object);
      });
  });
  it("matches the test data", () => {
    const testReview = reviewData.filter((review) => review_id === 1);
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toEqual(testReview);
      });
  });
});
