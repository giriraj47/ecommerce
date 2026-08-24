const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[Auth Service] Connected to Database");
  } catch (err) {
    console.error("[Auth Service] Database connection error:", err.message);
  }
}

module.exports = connectDb;
