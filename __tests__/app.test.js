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
        res.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("responds with an object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        console.log(res.body.review);
        expect(res.body.review).toBeInstanceOf(Object);
      });
  });
  it("matches the test data", () => {
    const testReview = reviewData.filter((review) => review.review_id === 1);
    console.log(reviewData, testReview);
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
});
