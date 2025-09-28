const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config({ path: ".env" });

const setupSwagger = require("./swagger");
const AppError = require("./src/utils/appError");
const authRouter = require("./src/routes/authRouter");
const urlRouter = require("./src/routes/urlRouter");
const errorController = require("./src/controllers/errorController");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", urlRouter);

setupSwagger(app);

app.all("*splat", (req, res, next) => {
  next(new AppError(`Can't find this route : ${req.originalUrl}`, 404));
});

app.use(errorController);

module.exports = app;
