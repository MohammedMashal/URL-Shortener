const AppError = require("../utils/appError");

// -------- JWT Errors --------
const handleJwtInvalidSignature = () =>
  new AppError("Authentication failed: Invalid token.", 401);

const handleJwtExpired = () =>
  new AppError("Authentication failed: Token expired.", 401);

// -------- Postgres Errors --------
const handlePgDuplicateField = (err) => {
  // code 23505 = unique_violation
  const detail = err.detail || "";
  return new AppError(
    `Duplicate field value: ${detail}. Please use another one.`,
    400
  );
};

const handlePgInvalidInput = (err) => {
  // code 22P02 = invalid_text_representation (e.g. invalid UUID)
  return new AppError(`Invalid input: ${err.message}`, 400);
};

// -------- Utils --------
const generateErrorId = () =>
  Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

// -------- Dev & Prod Response --------
const sendErrorDev = (err, res, errorId) => {
  res.status(err.statusCode).json({
    status: err.status,
    isOperational: err.isOperational,
    message: err.message,
    errorId,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res, errorId) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorId,
    });
  } else {
    console.error("💥 UNEXPECTED ERROR:", { errorId, err });

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
      errorId,
    });
  }
};

// -------- Global Error Middleware --------
module.exports = (err, req, res, next) => {
  const errorId = generateErrorId();

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res, errorId);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.code = err.code;
    error.name = err.name;

    // PostgreSQL error codes
    if (error.code === "23505") error = handlePgDuplicateField(error);
    if (error.code === "22P02") error = handlePgInvalidInput(error);

    // JWT errors
    if (error.name === "JsonWebTokenError") error = handleJwtInvalidSignature();
    if (error.name === "TokenExpiredError") error = handleJwtExpired();

    sendErrorProd(error, res, errorId);
  }
};
