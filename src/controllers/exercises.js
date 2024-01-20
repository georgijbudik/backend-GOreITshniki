const { Exercise } = require("../models/exercise");

const { Filter } = require("../models/filter");

const { HttpError, ctrlWrapper } = require("../helpers/");

const getExercises = async (req, res) => {
  const result = await Exercise.find();

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const types = {
  bodyparts: { filter: "Body parts" },
  muscles: { filter: "Muscles" },
  equipment: { filter: "Equipment" },
};

const getExercisesByType = async (req, res) => {
  const { type } = req.params;

  if (!types[type]) {
    throw HttpError(400, "Invalid type");
  }

  const query = types[type];
  const result = await Filter.find(query);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const getExercisesByName = async (req, res) => {
  const { type, name } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  if (!types[type]) {
    throw HttpError(400, "Invalid type");
  }

  const { filter } = types[type];

  let normalizedFilter;

  switch (filter) {
    case "Body parts":
      normalizedFilter = "bodyPart";
      break;

    case "Muscles":
      normalizedFilter = "target";
      break;

    case "Equipment":
      normalizedFilter = "equipment";
      break;

    default:
      throw HttpError(400, "Invalid type");
  }

  const query = {};
  query[normalizedFilter] = name;

  const exercises = await Exercise.find(query).skip(skip).limit(limit);

  if (!exercises) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(exercises);
};

module.exports = {
  getExercises: ctrlWrapper(getExercises),
  getExercisesByType: ctrlWrapper(getExercisesByType),
  getExercisesByName: ctrlWrapper(getExercisesByName),
};
