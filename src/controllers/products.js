const { ctrlWrapper } = require("../helpers");
const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");

const getProducts = async (req, res) => {
  const { search, category, type } = req.query;

  const { blood } = req.user;

  const productsQuery = Product.find();

  if (search) {
    productsQuery.where("title").equals(new RegExp(search, "i"));
  }
  if (category) {
    productsQuery.where("category").equals(category);
  }

  if (type === "recommended") {
    productsQuery.where("groupBloodNotAllowed." + blood).equals(false);
  } else if (type === "not recommended") {
    productsQuery.where("groupBloodNotAllowed." + blood).equals(true);
  }
  const products = await Product.find(productsQuery);
  res.status(200).json(products);
};

const getProductCategories = async (req, res) => {
  const categories = await ProductCategory.find();
  res.status(200).json(categories);
};

module.exports = {
  getProducts: ctrlWrapper(getProducts),
  getProductCategories: ctrlWrapper(getProductCategories),
};
