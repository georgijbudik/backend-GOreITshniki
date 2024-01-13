const { Exercise } = require('../models/exercise');

const { Filter } = require('../models/filter')

const { HttpError, ctrlWrapper } = require("../helpers/");


const getExercises = async(req, res) => {

    const result = await Exercise.find();

    if (!result) {
        throw HttpError(404, 'Not found');
      }
      res.json(result);
}

const getBodyParts = async(req, res) => {
    
    const result = await Filter.find({ filter: 'Body parts' });

    if (!result) {
        throw HttpError(404, 'Not found');
      }
      res.json(result);
}

const getMuscles = async(req, res) => {

    const result = await Filter.find({filter: 'Muscles'});

    if (!result) {
        throw HttpError(404, 'Not found');
      }
      res.json(result);
}

const getEquipment = async(req, res) => {

    const result = await Filter.find({filter: 'Equipment'});

    if (!result) {
        throw HttpError(404, 'Not found');
      }
      res.json(result);
}

module.exports = {
    getExercises: ctrlWrapper(getExercises),
    getBodyParts: ctrlWrapper(getBodyParts),
    getMuscles: ctrlWrapper(getMuscles),
    getEquipment: ctrlWrapper(getEquipment),
  }