const request = require("supertest");
const mongoose = require("mongoose");
const connectDB = require("../db");
const app = require("../server");

let token;

jest.setTimeout(30000);

// 🔥 FORCE DB connection BEFORE ANY TEST
beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.MONGO_URI = "mongodb://test-mongo:27017/ecommerce-test";

  await connectDB();

  // 🔥 VERY IMPORTANT (wait for connection ready)
  await new Promise(resolve => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once("open", resolve);
  });

  console.log("✅ Test DB Connected");
});

// 🔥 CLEANUP
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Ecommerce API Tests", () => {

  test("Register User", async () => {
    const email = `test${Date.now()}@test.com`;

    const res = await request(app)
      .post("/api/register")
      .send({
        name: "test",
        email,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });

  test("Login User", async () => {
    const email = `test${Date.now()}@test.com`;

    await request(app)
      .post("/api/register")
      .send({ name: "test", email, password: "123456" });

    const res = await request(app)
      .post("/api/login")
      .send({ email, password: "123456" });

    token = res.body.token;

    expect(res.statusCode).toBe(200);
    expect(token).toBeDefined();
  });

  test("Create Product", async () => {
    const email = `test${Date.now()}@test.com`;

    await request(app)
      .post("/api/register")
      .send({ name: "test", email, password: "123456" });

    const loginRes = await request(app)
      .post("/api/login")
      .send({ email, password: "123456" });

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
  });

  test("Get Products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
  });

});
