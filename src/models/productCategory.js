const { Schema, model } = require("mongoose");

const productCategorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
});

const ProductCategory = model("product-category", productCategorySchema);

module.exports = ProductCategory;
