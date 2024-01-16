const { ctrlWrapper } = require("../helpers");
const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const getProductCategories = async (req, res) => {
  const categories = await ProductCategory.find();
  res.status(200).json(categories);
};

const getProducts = async (req, res) => {
  
};

module.exports = {
  getProductCategories: ctrlWrapper(getProductCategories),
  getProducts: ctrlWrapper(getProducts),
};
