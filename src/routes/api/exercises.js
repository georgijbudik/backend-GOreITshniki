const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/exercises");

router.get("/:type?", authenticate, ctrl.getExercises);

router.get("/:type/:name", authenticate, ctrl.getExercisesByName);

module.exports = router;
