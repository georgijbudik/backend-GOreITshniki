const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  setTimeout(async () => {
    const { _id } = await User.findOne({ email });

    const payload = { id: _id };
    const tokenParse = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "23h",
    });

    await User.findByIdAndUpdate(_id, { token: tokenParse });

    const { token } = await User.findOne({ email });

    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
      token: token,
    });
  }, 1000);
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

  const userDataUpdate = {
    name: name,
    height: height,
    currentWeight: currentWeight,
    desiredWeight: desiredWeight,
    birthday: birthday,
    blood: blood,
    sex: sex,
    levelActivity: levelActivity,
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
  res.status(200).json(avatarURL);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
  addAvatar: ctrlWrapper(addAvatar),
};
