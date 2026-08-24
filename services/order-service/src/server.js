require("dotenv").config();
const app = require("./app");
const connectDb = require("./config/db");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    await connectDb();
    if (process.env.REDIS_URL) {
      await connectRedis();
    }
    app.listen(PORT, () => {
      console.log(`Order service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Order service startup failed:", error);
  }
}

startServer();
