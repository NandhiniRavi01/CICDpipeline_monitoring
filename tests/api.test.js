// tests/api.test.js
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let token; // store JWT token for authorized requests

// Connect to a separate test database
beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Drop database after each test to ensure isolation
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// Close DB connection after all tests
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

  // Your API returns the user object directly, so check res.body directly
  expect(res.body).toHaveProperty("_id");
  expect(res.body.email).toBe("test@test.com");
});

  test("Login User", async () => {
    // First, register user for login
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
    // Register and login user to get token
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
    // Add a product first
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

    const res = await request(app)
      .get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("name", "Phone");
  });

});
