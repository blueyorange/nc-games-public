const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const { idleTimeoutMillis } = require("pg/lib/defaults");
const { get } = require("express/lib/response");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

const { categoryData, reviewData, commentData, userData } = testData;

describe("GET /api", () => {
  it("serves a description of the api", () => {
    return request(app).get("/api").expect(200);
  });
});
describe("GET /api/categories", () => {
  it("matches the test data returns an array of objects with matching fields", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toEqual(categoryData);
        expect(res.body.categories.length).toBeGreaterThan(0);
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
  it("matches the test data in form and content (an array of objects)", () => {
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
          comment_count: expect.any(Number),
        });
      });
  });
  it("returns status 400 bad request for invalid review id", () => {
    return request(app).get("/api/reviews/invalid_id").expect(400);
  });
  it("returns status 404 not found for non existant review id", () => {
    return request(app).get("/api/reviews/999999").expect(404);
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("increases the number of votes when valid body posted", () => {
    const inc_votes = 3;
    const testReview = reviewData[0];
    const newVotes = testReview.votes + inc_votes;
    const body = {
      inc_votes,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(body)
      .expect(200)
      .then((res) => {
        expect(res.body.review.votes).toEqual(newVotes);
      });
  });

  it("decreases the number of votes when valid body posted", () => {
    const inc_votes = -3;
    const testReview = reviewData[0];
    const newVotes = testReview.votes + inc_votes;
    const body = {
      inc_votes,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(body)
      .expect(200)
      .then((res) => {
        expect(res.body.review.votes).toEqual(newVotes);
      });
  });

  it("returns 404 not found for non-existant review id", () => {
    const inc_votes = -3;
    const body = {
      inc_votes,
    };
    return request(app)
      .patch("/api/reviews/99999")
      .send(body)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });

  it("returns 400 for invalid inc_votes", () => {
    const invalidBody = { inc_votes: "yourmama" };
    return request(app).patch("/api/reviews/1").send(invalidBody).expect(400);
  });

  it("returns 200 for invalid additional fields in body", () => {
    const bodyWithExtraField = { inc_votes: 5, name: "Mitch" };
    return request(app)
      .patch("/api/reviews/1")
      .send(bodyWithExtraField)
      .expect(200);
  });

  it("returns status 400 for invalid review_id", () => {
    body = {};
    return request(app).patch("/api/reviews/invalid_id").send(body).expect(400);
  });

  it("returns status 200 for missing inc_votes key and has no effect on review", async () => {
    const body = {};
    const review = await request(app)
      .get("/api/reviews/2")
      .then((res) => {
        let review = res.body.review;
        delete review.comment_count;
        return review;
      });
    return request(app)
      .patch("/api/reviews/2")
      .send(body)
      .expect(200)
      .then((res) => {
        expect(res.body.review).toEqual(review);
      });
  });
});

describe("GET /api/reviews", () => {
  it("returns an array of objects with matching fields sorted by created_at, desc", () => {
    return request(app)
      .get("/api/reviews/")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(res.body.reviews.length).toBeGreaterThan(0);
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
  const sort_by = "designer";
  const reviewsSorted = reviewData
    .map((review) => {
      return { ...review, created_at: review.created_at.toISOString() };
    })
    .sort((a, b) => (a[sort_by] < b[sort_by] ? -1 : +1));

  it("returns reviews sorted by column", () => {
    return request(app)
      .get(`/api/reviews/?sort_by=${sort_by}`)
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy(sort_by, { descending: true });
      });
  });

  it("returns 400 bad request for incorrect column in sort_by", () => {
    return request(app).get(`/api/reviews/?sort_by=invalid_sort`).expect(400);
  });

  it("returns 400 bad request for not asc/desc in order", () => {
    return request(app).get(`/api/reviews/?order=invalid`).expect(400);
  });

  it("status 200 accepts category query", () => {
    const category = "dexterity";
    const matchingReviews = reviewData
      .filter((review) => review.category === category)
      .map((review) => {
        return { ...review, created_at: review.created_at.toISOString() };
      });
    return request(app)
      .get(`/api/reviews?category=${category}`)
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        for (let i = 0; i < reviews.length; i++) {
          let reviewToCheck = reviews[i];
          delete reviewToCheck.review_id;
          delete reviewToCheck.comment_count;
          expect(reviewToCheck).toEqual(matchingReviews[i]);
        }
      });
  });
  it("status 200 accepts order query", () => {
    return request(app)
      .get(`/api/reviews?order=ASC`)
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at");
      });
  });
  it("status 404 non-existent category query", () => {
    return request(app).get(`/api/reviews/?category=bananas`).expect(404);
  });

  it("status 200 valid category but no associated reviews returns empty array", () => {
    return request(app)
      .get("/api/reviews?category=children's%20games")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toEqual([]);
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

  it("status 400 invalid ID", () => {
    return request(app).get("/api/reviews/invalid_id/comments").expect(400);
  });

  it("status 404 non existent ID", () => {
    return request(app).get("/api/reviews/99999/comments").expect(404);
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
  it("status 404 for invalid comment_id", () => {
    return request(app).delete(`/api/comments/1000`).expect(404);
  });
});

describe("GET /api/users/", () => {
  it("status 200: returns an array of users", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });
});

describe("GET /api/users/:username", () => {
  it("200: returns a single user's data including an array containing their reviews", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then((res) => {
        expect(res.body.user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
          reviews: expect.any(Array),
        });
      });
  });
  it("404: user not found", () => {
    return request(app).get("/api/users/invalid_username").expect(404);
  });
});
