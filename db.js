const mongoose = require("mongoose");

const connectDB = async () => {
  const URI = process.env.MONGO_URI || "mongodb://mongo:27017/ecommerce";

  let retries = 5;

  while (retries) {
    try {
      await mongoose.connect(URI);
      console.log("✅ MongoDB Connected");
      break;
    } catch (err) {
      console.log("❌ MongoDB not ready, retrying...");
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (!retries) {
    console.error("❌ Could not connect to MongoDB");
    process.exit(1);
  }
};

module.exports = connectDB;
