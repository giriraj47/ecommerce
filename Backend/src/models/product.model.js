const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["clothing", "shoes", "accessories"],
      required: true,
    },

    size: {
      type: String,
      default: null,
    },

    measurements: {
      type: String,
      default: null,
    },

    colors: {
      type: [String],
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
