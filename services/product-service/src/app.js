const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const productRouter = require("./routes/product.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.send({ status: "OK", service: "product-service" });
});

app.use("/api/products", productRouter);

module.exports = app;
