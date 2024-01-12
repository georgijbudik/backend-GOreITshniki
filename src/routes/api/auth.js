const express = require("express");
const { validateBody, authenticate, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/user");
const {
  register,
  login,
  logout,
  getCurrent,
} = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);

router.post("/login", validateBody(schemas.loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

module.exports = router;
