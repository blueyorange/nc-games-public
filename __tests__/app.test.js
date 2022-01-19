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
    return request(app).get("/api/reviews/invalid_id").expect(400);
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

describe("GET /api/reviews", () => {
  it("returns all reviews as an array", () => {
    return request(app)
      .get("/api/reviews/")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("returns an array of comments", () => {
    const review_id = 3;
    const expectedComments = commentData
      .filter((comment) => comment.review_id === review_id)
      .map((comment) => {
        return { ...comment, created_at: comment.created_at.toISOString() };
      });
    return request(app)
      .get(`/api/reviews/${review_id}/comments/`)
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        const comments = res.body.comments.map((comment) => {
          delete comment.comment_id;
          return comment;
        });
        expect(comments).toEqual(expectedComments);
      });
  });
});

describe("POST /api/reviews/:review_id/comments/", () => {
  const review_id = 1;
  const comment = {
    username: "mallionaire",
    body: "i HATE this game.",
  };
  it("returns an array of comments from a review_id", () => {
    return request(app)
      .post(`/api/reviews/${review_id}/comments/`)
      .send(comment)
      .expect(200)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          author: comment.username,
          body: comment.body,
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("returns 400 not found for incorrect review id", () => {
    const review_id = 999999;
    return request(app)
      .post(`/api/reviews/${review_id}/comments/`)
      .send(comment)
      .expect(400);
  });
  it("returns error 400 for invalid review id", () => {
    return request(app)
      .post(`/api/reviews/:invalid_id/comments/`)
      .send(comment)
      .expect(400);
  });
  it("returns error 400 not found for invalid username", () => {
    let comment_invalid = { username: "invalid", body: "ooooh" };
    return request(app)
      .post(`/api/reviews/${review_id}/comments/`)
      .send(comment_invalid)
      .expect(400);
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("should return 204 and result in deleted entry", () => {
    const comment_id = 1;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(async (res) => {
        expect(res.body).toEqual({});
        const commentQuery = await db.query(
          `SELECT * FROM comments WHERE comment_id=$1`,
          [comment_id]
        );
        // comment is deleted so should return empty query
        expect(commentQuery.rows).toEqual([]);
      });
  });
  it("status 404", () => {
    return request(app).delete(`/api/comments/1000`).expect(404);
  });
});
