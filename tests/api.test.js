const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let token;

// ✅ FIX: use env OR fallback to docker service name
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/ecommerce";

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Ecommerce API Tests", () => {

  test("Register User", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.email).toBe("test@test.com");
  });

  test("Login User", async () => {
    await request(app)
      .post("/api/register")
      .send({ name: "test", email: "test@test.com", password: "123456" });

    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@test.com", password: "123456" });

    token = res.body.token;

    expect(res.statusCode).toBe(200);
    expect(token).toBeDefined();
  });

  test("Create Product", async () => {
    await request(app)
      .post("/api/register")
      .send({ name: "test", email: "test@test.com", password: "123456" });

    const loginRes = await request(app)
      .post("/api/login")
      .send({ email: "test@test.com", password: "123456" });

    token = loginRes.body.token;

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Phone",
        price: 500,
        image: "phone.jpg"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Phone");
  });

  test("Get Products", async () => {
    await request(app)
      .post("/api/register")
      .send({ name: "test", email: "test@test.com", password: "123456" });

    const loginRes = await request(app)
      .post("/api/login")
      .send({ email: "test@test.com", password: "123456" });

    token = loginRes.body.token;

    await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Phone",
        price: 500,
        image: "phone.jpg"
      });

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("name", "Phone");
  });

});
