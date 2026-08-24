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
      enum: ["clothing", "footwear", "accessories"],
      required: true,
    },

    subCategory: {
      type: String,
      enum: ["top", "bottom"],
      required: function () {
        let category = this.category;
        if (!category && typeof this.getUpdate === "function") {
          const update = this.getUpdate();
          if (update) {
            category = (update.$set && update.$set.category) || update.category;
          }
        }
        return category === "clothing";
      },
      validate: {
        validator: function (value) {
          let category = this.category;
          if (!category && typeof this.getUpdate === "function") {
            const update = this.getUpdate();
            if (update) {
              category = (update.$set && update.$set.category) || update.category;
            }
          }
          if (value && category && category !== "clothing") {
            return false;
          }
          return true;
        },
        message: "Subcategory is only allowed for the 'clothing' category.",
      },
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
      type: String,
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes to speed up queries, regex searches, and sorting
productSchema.index({ name: 1, category: 1, price: 1, createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

productSchema.virtual("isLatest").get(function () {
  if (!this.createdAt) return false;
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const now = new Date();
  return now - this.createdAt < thirtyDaysInMs;
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
