const express = require("express");
const orderRouter = express.Router();
const {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { authUser } = require("../middleware/auth.middleware");

orderRouter.post("/create", authUser, createOrder);
orderRouter.get("/my", authUser, getMyOrders);
orderRouter.get("/:orderId", authUser, getSingleOrder);
orderRouter.get("/", authUser, getAllOrders);
orderRouter.patch("/:orderId/status", authUser, updateOrderStatus);

module.exports = orderRouter;
