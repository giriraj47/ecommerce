const productModel = require("../models/product.model");
const { uploadImage } = require("../services/storage.service");

const createProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const { name, description, price, category, sizes, colors, stock } =
      req.body;

    // 1. Basic Validation
    if (!name || !description || !price || !category) {
      res.status(400);
      throw new Error(
        "Please provide all required fields: name, description, price, and category.",
      );
    }

    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error("Please upload images");
    }

    const uploadPromises = req.files.map((file) => uploadImage(file.path));
    const imageUrls = await Promise.all(uploadPromises);

    // 2. Create the Product
    const product = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      colors: Array.isArray(colors) ? colors : [colors],
      images: imageUrls,
    });

    // 3. Response
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  // slice: 1 means "get the first 1 element"
  const products = await productModel
    .find()
    .select("name price")
    .slice("images", 1);

  res.status(200).json(products);
};

const getProductById = async (req, res) => {
  const product = await productModel
    .findById(req.params.id)
    .select("name description price category sizes colors images stock");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Product found", product });
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage(file.path));
      const newImageUrls = await Promise.all(uploadPromises);

      updateData.images = newImageUrls;

      // updateData.images = [...product.images, ...newImageUrls];
    }

    if (updateData.name) {
      updateData.name = updateData.name;
    }
    if (updateData.description) {
      updateData.description = updateData.description;
    }
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.category) {
      updateData.category = updateData.category;
    }
    if (updateData.colors) {
      updateData.colors = Array.isArray(updateData.colors)
        ? updateData.colors
        : [updateData.colors];
    }
    if (updateData.sizes) {
      updateData.sizes = Array.isArray(updateData.sizes)
        ? updateData.sizes
        : [updateData.sizes];
    }
    if (updateData.stock) {
      updateData.stock = Number(updateData.stock);
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const product = await productModel.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, message: "Product deleted" });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
