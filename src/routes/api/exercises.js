const express = require("express");
const router = express.Router();
const { authenticate } = require('../../middlewares');
const ctrl = require("../../controllers/exercises");



router.get("/", authenticate, ctrl.getExercises);

router.get("/bodyparts", authenticate, ctrl.getBodyParts);

router.get("/muscles", authenticate, ctrl.getMuscles);

router.get("/equipment", authenticate, ctrl.getEquipment);

module.exports = router;