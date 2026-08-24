const express = require("express");
const paymentRouter = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/razorpay.controller");
const { authUser } = require("../middleware/auth.middleware");

paymentRouter.post("/checkout", authUser, createRazorpayOrder);
paymentRouter.post("/verify", authUser, verifyRazorpayPayment);

module.exports = paymentRouter;
