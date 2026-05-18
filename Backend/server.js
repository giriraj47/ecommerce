require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
const razorpay = require("./src/config/razorpay");

async function startApp() {
  try {
    // Connect to MongoDB
    await connectDb();

    // Connect to Cloud Redis
    await connectRedis();

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Setup failed:", error);
  }
}

startApp();
