const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const { client } = require("../config/redis");
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require("../services/email.service");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await cartModel
      .findOne({ user: req.user.id })
      .populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    for (const item of cart.products) {
      const product = item.product;

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} available`,
        });
      }
    }

    const orderProducts = cart.products.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const order = await orderModel.create({
      user: req.user.id,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      totalAmount: cart.totalAmount,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      orderStatus: paymentMethod === "cod" ? "confirmed" : "paid",
    });

    for (const item of cart.products) {
      await productModel.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    await cartModel.findOneAndDelete({
      user: req.user.id,
    });

    if (client.isOpen) {
      await client.del(`carts:${req.user.id}`);
    }

    const user = await userModel.findById(req.user.id);
    if (user) {
      sendOrderConfirmationEmail(user.email, user.name, order).catch((err) => {
        console.error("Failed to send order email:", err);
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderModel.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        message: "Order already delivered",
      });
    }

    order.orderStatus = status;
    await order.save();

    const user = await userModel.findById(order.user);
    if (user) {
      sendOrderStatusUpdateEmail(user.email, user.name, order).catch((err) => {
        console.error("Failed to send order status update email:", err);
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
};
