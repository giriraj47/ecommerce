const productModel = require("../models/product.model");
const { uploadImage } = require("../services/storage.service");
const { client } = require("../config/redis");

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

    const keys = await client.keys("products:*");

    if (keys.length > 0) {
      await client.del(keys);
    }

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

const deleteProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 16;

  const skip = (page - 1) * limit;
  const product = await productModel.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const keys = await client.keys("products:*");

  if (keys.length > 0) {
    await client.del(keys);
  }

  res.status(200).json({ success: true, message: "Product deleted" });
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

    // Invalidate Cache
    await client.del("products:all");

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

const getAllProducts = async (req, res) => {
  try {
    // Query params
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const limit = 16;
    const skip = (page - 1) * limit;

    const filter = {
      name: {
        $regex: search,
        $options: "i", // case-insensitive
      },
    };

    // Create unique cache key for each page
    const cacheKey = `products:search=${search}:page=${page}`;

    // 1. Try Redis cache
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("Serving from Redis Cache");

      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("Serving from MongoDB (Cache Miss)");

    // 2. Fetch paginated products
    const products = await productModel
      .find(filter)
      .select("name price")
      .slice("images", 1)
      .skip(skip)
      .limit(limit);

    // Optional: total products count
    const totalProducts = await productModel.countDocuments(filter);

    const responseData = {
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      search,
      products,
    };

    // 3. Save to Redis
    await client.set(cacheKey, JSON.stringify(responseData), {
      EX: 3600,
    });

    // 4. Send response
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
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

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
