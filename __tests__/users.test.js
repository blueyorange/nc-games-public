const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/users/", () => {
  it("status 200: returns an array of users", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            }),
          ])
        );
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
    return request(app).get("/api/users/non-user").expect(404);
  });
});

describe("PATCH /api/users/:username", () => {
  const name = "harry";
  it("200: amends name of user", () => {
    return request(app)
      .patch("/api/users/mallionaire")
      .send({ name })
      .expect(200)
      .then((res) => {
        const { user } = res.body;
        expect(user).toEqual(expect.objectContaining({ name }));
      });
  });
  it("200: amends name and avatar_url of user", () => {
    const name = "harry";
    const avatar_url = "http://www.myavatar.com/aihrpiwoenk";
    return request(app)
      .patch("/api/users/mallionaire")
      .send({ name, avatar_url })
      .expect(200)
      .then((res) => {
        const { user } = res.body;
        expect(user).toEqual(expect.objectContaining({ name, avatar_url }));
      });
  });
  it("200: avatar_url of user only", () => {
    const avatar_url = "http://www.myavatar.com/aihrpiwoenk";
    return request(app)
      .patch("/api/users/mallionaire")
      .send({ avatar_url })
      .expect(200)
      .then((res) => {
        const { user } = res.body;
        expect(user).toEqual(expect.objectContaining({ avatar_url }));
      });
  });
  it("400: badly formed request body", () => {
    const invalid_field = "INVALID";
    return request(app)
      .patch("/api/users/mallionaire")
      .send({ invalid_field })
      .expect(400);
  });
});
