const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const productsRouter = require("./src/routes/api/products");
const diaryRouter = require("./src/routes/api/diary");
require("dotenv").config();

const authRouter = require("./src/routes/api/auth");
const exercisesRouter = require("./src/routes/api/exercises");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/exercises", exercisesRouter);
app.use("/api/users", authRouter);

app.use("/api/products", productsRouter);
app.use("/api/diary", diaryRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
