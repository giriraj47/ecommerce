// src/config/redis.js
const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  url: process.env.REDIS_URL,
  // If you get certificate errors with some providers, add:
  // socket: {
  //   tls: true,
  //   rejectUnauthorized: false
  // }
});

client.on("error", (err) => console.log("Redis Connection Error", err));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log("Connected to Cloud Redis!");
  }
};

module.exports = { client, connectRedis };
