const Joi = require("joi").extend(require("@joi/date"));
const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const emailRegexp = /^w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      min: 150,
      default: null,
      required: false,
    },
    currentWeight: {
      type: Number,
      required: false,
      min: 35,
      default: null,
    },
    desiredWeight: {
      type: Number,
      min: 35,
      default: null,
      required: false,
    },
    birthday: {
      type: Date,
      max: "2006-01-01",
      required: false,
      default: null,
    },
    blood: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: false,
      default: null,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      default: null,
      required: false,
    },
    levelActivity: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: false,
    },
    calories: {
      type: String,
      required: false,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

const updateUser = Joi.object({
  name: Joi.string().required(),
  height: Joi.number().required().min(150),
  currentWeight: Joi.number().required().min(35),
  desiredWeight: Joi.number().required().min(35),
  birthday: Joi.date().format("YYYY-MM-DD").required().max("2006-01-01"),
  blood: Joi.number().required().valid(1, 2, 3, 4),
  sex: Joi.string().required().valid("male", "female"),
  levelActivity: Joi.number().required().valid(1, 2, 3, 4, 5),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateUser,
};

const User = model("users", userSchema);

module.exports = {
  User,
  schemas,
};
