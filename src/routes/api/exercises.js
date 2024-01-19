const express = require("express");
const router = express.Router();
const { authenticate } = require('../../middlewares');
const ctrl = require("../../controllers/exercises");



router.get("/", authenticate, ctrl.getExercises);

router.get('/:type', authenticate, ctrl.getExercisesByType);


module.exports = router;