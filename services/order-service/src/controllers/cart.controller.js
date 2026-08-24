const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const { client } = require("../config/redis");

const addProductToCart = async (req, res) => {
  try {
    const { product: productId, quantity } = req.body;

    const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (quantity > existingProduct.stock) {
      return res.status(400).json({
        message: `we only have ${existingProduct.stock} units of ${existingProduct.name} left`,
      });
    }

    let cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
      cart = await cartModel.create({
        user: req.user.id,
        products: [
          {
            product: productId,
            quantity,
            price: existingProduct.price,
          },
        ],
        totalAmount: existingProduct.price * quantity,
      });

      await cart.populate("products.product", "name price images");
      const formattedCart = cart.products.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || null,
        quantity: item.quantity,
      }));

      return res.status(201).json({
        message: "Product added to cart",
        products: formattedCart,
        totalAmount: cart.totalAmount,
      });
    }

    const existingCartProduct = cart.products?.find(
      (item) => item.product.toString() === productId,
    );

    const currentCartQuantity = existingCartProduct
      ? existingCartProduct.quantity
      : 0;

    const finalQuantity = currentCartQuantity + quantity;

    if (finalQuantity > existingProduct.stock) {
      return res.status(400).json({
        message: `Only ${existingProduct.stock} units of ${existingProduct.name} available`,
      });
    }

    if (existingCartProduct) {
      existingCartProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
        price: existingProduct.price,
      });
    }

    cart.totalAmount += existingProduct.price * quantity;

    await cart.save();

    await cart.populate("products.product", "name price images");

    const formattedCart = cart.products.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0] || null,
      quantity: item.quantity,
    }));

    if (client.isOpen) {
      await client.del(`carts:${req.user.id}`);
    }

    res.status(200).json({
      message: "Product added to cart",
      products: formattedCart,
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cacheKey = `carts:${req.user.id}`;

    if (client.isOpen) {
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
    }

    const cart = await cartModel
      .findOne({ user: req.user.id })
      .select("products.product products.quantity totalAmount")
      .populate("products.product", "name price images");

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        products: [],
        totalAmount: 0,
      });
    }

    const formattedCart = cart.products.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0] || null,
      quantity: item.quantity,
    }));

    const responseData = {
      message: "Cart fetched successfully",
      products: formattedCart,
      totalAmount: cart.totalAmount,
    };

    if (client.isOpen) {
      await client.set(cacheKey, JSON.stringify(responseData), {
        EX: 60 * 10,
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCart = async (req, res) => {
  try {
    await cartModel.deleteOne({ user: req.user.id });

    if (client.isOpen) {
      await client.del(`carts:${req.user.id}`);
    }

    res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const { product: productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cartProduct = cart.products.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartProduct) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (quantity > existingProduct.stock) {
      return res.status(400).json({
        message: `Only ${existingProduct.stock} units of ${existingProduct.name} available`,
      });
    }

    if (quantity === 0) {
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId,
      );
    } else {
      cartProduct.quantity = quantity;
    }

    cart.totalAmount = cart.products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    await cart.save();

    await cart.populate("products.product", "name price images");
    const formattedCart = cart.products.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0] || null,
      quantity: item.quantity,
    }));

    if (client.isOpen) {
      await client.del(`carts:${req.user.id}`);
    }

    res.status(200).json({
      message: "Product quantity updated",
      products: formattedCart,
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addProductToCart,
  getCart,
  updateProductQuantity,
  deleteCart,
};
