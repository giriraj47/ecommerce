require("dotenv").config();
const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Auth service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Auth service startup failed:", error);
  }
}

startServer();
