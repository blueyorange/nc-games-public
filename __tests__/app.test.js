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
        expect(res.body.review).toBeInstanceOf(Object);
      });
  });
  it("matches the test data", () => {
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
  it("returns status 400 bad request", () => {
    return request(app)
      .get("/api/reviews/invalid_id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request: invalid id");
      });
  });
  it("returns status 404 not found", () => {
    return request(app).get("/api/reviews/999999").expect(404);
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  const testReview = reviewData[0];
  const body = {
    title: "Agricoola",
    review_body: "A great farmyard game for all the family!",
  };
  const amendedReview = { ...testReview, ...body, review_id: 1 };
  it("amends the title and review_body", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send(body)
      .expect(200)
      .then((res) => {
        expect(res.body.review).toEqual(amendedReview);
      });
  });
});
