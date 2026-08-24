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
    const {
      name,
      description,
      price,
      category,
      subCategory,
      size,
      colors,
      stock,
      measurements,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Please provide all required fields: name, description, price, and category.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload images",
      });
    }

    const uploadPromises = req.files.map((file) => uploadImage(file.path));
    const imageUrls = await Promise.all(uploadPromises);

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      subCategory,
      stock,
      size,
      measurements,
      colors,
      images: imageUrls,
    });

    if (client.isOpen) {
      const keys = await client.keys("products:*");
      if (keys.length > 0) {
        await client.del(keys);
      }
    }

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
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (client.isOpen) {
      const keys = await client.keys("products:*");
      if (keys.length > 0) {
        await client.del(keys);
      }
    }

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage(file.path));
      const newImageUrls = await Promise.all(uploadPromises);
      updateData.images = [...product.images, ...newImageUrls];
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (client.isOpen) {
      const keys = await client.keys("products:*");
      if (keys.length > 0) {
        await client.del(keys);
      }
    }

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
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const sort = req.query.sort || "";
    const price = req.query.price || "";

    const limit = 16;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category && category !== "ALL") {
      if (
        category === "FOOTWEAR" ||
        category === "FOOTWARE" ||
        category === "FOOTWERE"
      ) {
        filter.category = "footwear";
      } else if (category === "ACCESSORIES") {
        filter.category = "accessories";
      } else if (category === "TOPS") {
        filter.category = "clothing";
        if (search) {
          filter.$and = [
            { name: { $regex: search, $options: "i" } },
            {
              name: {
                $regex:
                  /(shirt|tee|sweatshirt|hoodie|blazer|jacket|top|vest|polo|cardigan)/i,
              },
            },
          ];
        } else {
          filter.name = {
            $regex:
              /(shirt|tee|sweatshirt|hoodie|blazer|jacket|top|vest|polo|cardigan)/i,
          };
        }
      } else if (category === "BOTTOMS") {
        filter.category = "clothing";
        if (search) {
          filter.$and = [
            { name: { $regex: search, $options: "i" } },
            {
              name: {
                $regex: /(pant|trouser|jean|short|skirt|legging|jogger)/i,
              },
            },
          ];
        } else {
          filter.name = {
            $regex: /(pant|trouser|jean|short|skirt|legging|jogger)/i,
          };
        }
      }
    }

    if (price) {
      const bands = price
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b !== "");
      if (bands.length > 0) {
        const priceFilters = bands
          .map((band) => {
            if (band === "Under $25") return { price: { $lt: 25 } };
            if (band === "$25 - $50") return { price: { $gte: 25, $lte: 50 } };
            if (band === "$50 - $100")
              return { price: { $gte: 50, $lte: 100 } };
            if (band === "$100 - $200")
              return { price: { $gte: 100, $lte: 200 } };
            if (band === "$200 - $500")
              return { price: { $gte: 200, $lte: 500 } };
            if (band === "Above $500") return { price: { $gt: 500 } };
            return null;
          })
          .filter((f) => f !== null);

        if (priceFilters.length > 0) {
          filter.$or = priceFilters;
        }
      }
    }

    let sortQuery = {};
    if (sort === "Price: Low to High") {
      sortQuery.price = 1;
    } else if (sort === "Price: High to Low") {
      sortQuery.price = -1;
    } else if (sort === "Newest") {
      sortQuery.createdAt = -1;
    }

    const cacheKey = `products:search=${search}:category=${category}:sort=${sort}:price=${price}:page=${page}`;

    if (client.isOpen) {
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
    }

    // Parallelize find query with lean optimization and total count calculation
    const [products, totalProducts] = await Promise.all([
      productModel
        .find(filter)
        .sort(sortQuery)
        .select("name price stock category subCategory images")
        .slice("images", 1)
        .skip(skip)
        .limit(limit)
        .lean(),
      productModel.countDocuments(filter),
    ]);

    const responseData = {
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      search,
      products,
    };

    if (client.isOpen) {
      await client.set(cacheKey, JSON.stringify(responseData), {
        EX: 3600,
      });
    }

    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .select(
        "name description price category subCategory size colors images stock measurements",
      )
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product found", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLatestProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ isLatest: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name price images")
      .slice("images", 1)
      .lean();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productModel
      .find({ category })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("name price images")
      .slice("images", 1)
      .lean();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getProductsByCategory,
};
