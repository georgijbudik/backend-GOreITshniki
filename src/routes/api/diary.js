const express = require("express");
const {
  addExercise,
  addProduct,
  getInfo,
  deleteExerciseById,
  deleteProductById,
} = require("../../controllers/diary.js");
const {
  addExerciseSchema,
  addProductSchema,
  // deleteSchema,
} = require("../../models/Day.js");
const { authenticate, isEmptyBody, validateBody } = require("../../middlewares/index.js");

const addExerciseSchemaValidate = validateBody(addExerciseSchema);
const addProductSchemaValidate = validateBody(addProductSchema);
// const deleteSchemaValidate = validateBody(deleteSchema);

const diaryRouter = express.Router();

diaryRouter.get("/day", authenticate, getInfo);

diaryRouter.patch(
  "/exercise/:id",
  authenticate,
  isEmptyBody,
  addExerciseSchemaValidate,
  addExercise
);

diaryRouter.patch(
  "/product/:id",
  authenticate,
  isEmptyBody,
  addProductSchemaValidate,
  addProduct
);

diaryRouter.delete(
  "/exercise/:id/",
  authenticate,
  // isEmptyBody,
  // deleteSchemaValidate,
  deleteExerciseById
);

diaryRouter.delete(
  "/product/:id/",
  authenticate,
  // isEmptyBody,
  // deleteSchemaValidate,
  deleteProductById
);

module.exports = diaryRouter;
