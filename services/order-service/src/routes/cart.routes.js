const express = require("express");
const {
  addProductToCart,
  getCart,
  updateProductQuantity,
  deleteCart,
} = require("../controllers/cart.controller");
const { authUser } = require("../middleware/auth.middleware");

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addProductToCart);
cartRouter.get("/get", authUser, getCart);
cartRouter.patch("/update", authUser, updateProductQuantity);
cartRouter.delete("/delete", authUser, deleteCart);

module.exports = cartRouter;
