const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Ecommerce MongoDB API Running");
});

// ✅ export app ALWAYS
module.exports = app;

// ✅ only start server if NOT test
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  });
}
