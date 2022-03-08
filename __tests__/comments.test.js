const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

const { commentData } = testData;

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
  it("status 404 for non existant comment_id", () => {
    return request(app).delete(`/api/comments/1000`).expect(404);
  });
  it("status 400 for invalid comment_id", () => {
    return request(app).delete(`/api/comments/invalid_id`).expect(400);
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  it("200: increases the number of votes by inc_votes", () => {
    const currVotes = commentData[0].votes;
    return request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send({ inc_votes: 1 })
      .then((res) => {
        expect(res.body.comment.votes).toBe(currVotes + 1);
      });
  });
  it("400: invalid id", () => {
    return request(app).patch("/api/comments/not-an-id").expect(400);
  });
  it("404: comment not found", () => {
    return request(app).patch("/api/comments/9999999").expect(404);
  });
  it("400: invalid inc_votes", () => {
    const currVotes = commentData[0].votes;
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "I should be a number!" })
      .expect(400);
  });
  it("200: missing inc_votes key, no effect to comment", () => {
    const currVotes = commentData[0].votes;
    return request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send({})
      .then((res) => {
        expect(res.body.comment.votes).toBe(currVotes);
      });
  });
  it("200: amends comment if body present", () => {
    const body = "amended!";
    return request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send({ body })
      .then((res) => {
        expect(res.body.comment.body).toBe(body);
      });
  });
});
