const app = require("./");
const supertest = require("supertest");
const request = supertest(app);
describe("Route Testing", () => {
  test("GET /", async done => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("bon");
    done();
  });
});
