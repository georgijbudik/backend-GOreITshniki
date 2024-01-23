const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const {
  register,
  login,
  logout,
  getCurrent,
  updateUser,
  addAvatar,
} = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);

router.post("/login", validateBody(schemas.loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch(
  "/update",
  authenticate,
  validateBody(schemas.updateUser),
  updateUser
);

router.post("/avatar", authenticate, upload.single("avatarURL"), addAvatar);

module.exports = router;
