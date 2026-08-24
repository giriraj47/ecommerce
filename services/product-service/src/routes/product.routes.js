const express = require("express");
const productRouter = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getProductsByCategory,
} = require("../controllers/product.controller");
const { authUser } = require("../middleware/auth.middleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

productRouter.post(
  "/create-product",
  authUser,
  upload.array("image", 5),
  createProduct,
);

productRouter.get("/get-all-products", getAllProducts);
productRouter.get("/get-product/:id", getProductById);
productRouter.get("/latest", getLatestProducts);

productRouter.patch(
  "/update-product/:id",
  authUser,
  upload.array("image", 5),
  updateProduct,
);
productRouter.delete(
  "/delete-product/:id",
  authUser,
  upload.array("image", 5),
  deleteProduct,
);

module.exports = productRouter;
