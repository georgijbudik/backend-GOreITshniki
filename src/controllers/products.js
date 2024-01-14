const { ctrlWrapper } = require("../helpers");
const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const getProductCategories = async (req, res) => {
  const categories = await ProductCategory.find();
  res.status(200).json(categories);
};

// const getProductsCategoriesById = async (req, res) => {
//   const { id } = req.body;
//   const category = await ProductCategory.findById(id);
//   res.json(category);
// };

// const getProductsByCategory = async (req, res) => {
//   const { id } = req.body;
//   const category = getProductsCategoriesById(id);
//   const products = await Product.find({ $where: { category } });
//   res.json(products);
// };

module.exports = {
  getProductCategories: ctrlWrapper(getProductCategories),
  // getProductsCategoriesById,
  // getProductsByCategory,
};
