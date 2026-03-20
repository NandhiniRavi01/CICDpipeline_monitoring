const mongoose = require("mongoose");

const connectDB = async () => {
  const URI = process.env.MONGO_URI || "mongodb://mongo:27017/ecommerce_test";

  let retries = 10; // 🔥 increase retries

  while (retries) {
    try {
      await mongoose.connect(URI);
      console.log("✅ MongoDB Connected");
      return; // ✅ exit function
    } catch (err) {
      console.log("❌ MongoDB not ready, retrying...");
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  console.error("❌ Could not connect to MongoDB");
  // ❌ DO NOT crash in test
  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
};

module.exports = connectDB;
