const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.log("[Product Service] Redis Connection Error", err));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log("[Product Service] Connected to Redis!");
  }
};

module.exports = { client, connectRedis };
