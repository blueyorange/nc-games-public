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
  const inc_votes = 3;
  const testReview = reviewData[0];
  const body = {
    inc_votes: inc_votes,
  };
  const amendedReview = {
    ...testReview,
    votes: testReview.votes + inc_votes,
    created_at: testReview.created_at.toISOString(),
    review_id: 1,
  };
  it("increases the number of votes", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send(body)
      .expect(200)
      .then((res) => {
        expect(res.body.review).toEqual(amendedReview);
      });
  });
  it("rejects a request with incorrect field", () => {
    const body = {
      invalid_field: "A great farmyard game for all the family!",
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(body)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid field");
      });
  });
  it("returns 404 not found", () => {
    return request(app)
      .patch("/api/reviews/99999")
      .send(body)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
});
