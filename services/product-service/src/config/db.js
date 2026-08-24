const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[Product Service] Connected to Database");
  } catch (err) {
    console.error("[Product Service] Database connection error:", err.message);
  }
}

module.exports = connectDb;
