const { Exercise } = require("../models/exercise");
const { Filter } = require("../models/filter");
const { HttpError, ctrlWrapper } = require("../helpers/");

const types = {
  bodyparts: { filter: "Body parts" },
  muscles: { filter: "Muscles" },
  equipment: { filter: "Equipment" },
};

const getExercises = async (req, res) => {
  const { type = "" } = req.params;
  if (type && !types[type]) {
    throw HttpError(400, "Invalid type");
  }

  let result;
  if (type) {
    const query = types[type];
    result = await Filter.find(query);
  } else {
    result = await Exercise.find();
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
  getExercisesByName: ctrlWrapper(getExercisesByName),
};
