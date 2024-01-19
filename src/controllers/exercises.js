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

const types = {
  bodyparts: { filter: 'Body parts' },
  muscles: { filter: 'Muscles' },
  equipment: { filter: 'Equipment' },
};


const getExercisesByType = async (req, res) => {

  const { type } = req.params;

  if (!types[type]) {
    throw HttpError(400, 'Invalid type');
  }

  const query = types[type];
  const result = await Filter.find(query);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};


module.exports = {
    getExercises: ctrlWrapper(getExercises),
    getExercisesByType: ctrlWrapper(getExercisesByType),
  }