const ctrl = require("../../controllers/products");
const express = require("express");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, ctrl.getProducts);

router.get("/categories", authenticate, ctrl.getProductCategories);

module.exports = router;
