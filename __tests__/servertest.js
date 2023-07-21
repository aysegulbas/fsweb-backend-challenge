const request = require("supertest");
const server = require("../api/server");
const db = require("../data/db-config");
beforeAll(async () => {
  await db.migrate.rollback(); //temizlesin
  await db.migrate.latest(); //son halini getir
  await db.seed.run();
});
test("[0] sanity check", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});
describe("AUTH", () => {
  test("[1] register", async () => {
    const payload = { username: "ali", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("user_id", 4);
  });
  test("[2] register failure", async () => {
    const payload = { username: "ali", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("message", "User zaten var");
  });
  test("[3] login", async () => {
    //loginde en önemli test token
    const payload = { username: "ali", password: "12345" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("message", "ali geri geldi");
  });
  test("[4] login failure", async () => {
    //loginde en önemli test token
    const payload = { username: "ali", password: "12" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).toHaveProperty(
      "message",
      "geçersiz kullanıcı adı veya şifre"
    );
  });
});
describe("RESTRICTION", () => {
  test("[5] get twt", async () => {
    const res = await request(server).get("/api/users/twt/1");
    expect(res.body).toHaveProperty("message", "token gereklidir");
  });
  test("[6] get user", async () => {
    const payload = { username: "ali", password: "12345" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);
    const res = await request(server)
      .get("/api/users/twt/1")
      .set("Authorization", loginRes.body.token);
    expect(res.body).toHaveLength(2);
  });
});
