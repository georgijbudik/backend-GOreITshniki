const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Diary = require("../models/Diary");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

  const { _id } = await User.findOne({ email });

  await Diary.create({ owner: newUser._id });

  const payload = { id: _id };
  const tokenParse = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "23h",
  });

  await User.findByIdAndUpdate(_id, { token: tokenParse });

  const { token } = await User.findOne({ email });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "23h",
  });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
};

const getCurrent = async (req, res) => {
  const {
    email,
    name,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
    avatarURL,
    calories,
  } = req.user;

  const userData = {
    email,
    name,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
    avatarURL,
    calories,
  };

  res.json(userData);
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(200).json({
    message: "Logout success",
  });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;

  const {
    name,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  } = req.body;

  const year = new Date(birthday);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - year.getFullYear();

  if (
    currentDate.getMonth() < year.getMonth() ||
    (currentDate.getMonth() === year.getMonth() &&
      currentDate.getDate() < year.getDate())
  ) {
    age--;
  }

  let level;

  switch (levelActivity) {
    case 1:
      level = 1.2;
      break;
    case 2:
      level = 1.375;
      break;
    case 3:
      level = 1.55;
      break;
    case 4:
      level = 1.725;
      break;
    case 5:
      level = 1.9;
      break;
  }

  let calories;

  switch (sex) {
    case "male":
      const calculatorMale =
        (10 * currentWeight + Math.round(6.25 * height) - 5 * age + 5) * level;
      calories = Math.round(calculatorMale);
      break;
    case "female":
      const calculatorFemale =
        (10 * currentWeight + 6, 25 * height - 5 * age - 161) * level;
      calories = Math.round(calculatorFemale);
      break;
  }

  const userDataUpdate = {
    name,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
    calories,
  };

  const user = await User.findOne({ _id });

  await User.findOneAndUpdate(user, userDataUpdate);

  res.status(200).json(userDataUpdate);
};

const addAvatar = async (req, res) => {
  const avatarURL = req.file.path;
  const { _id } = req.user;

  const user = await User.findOne(_id);

  await User.findOneAndUpdate(user, { avatarURL: avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
  addAvatar: ctrlWrapper(addAvatar),
};
