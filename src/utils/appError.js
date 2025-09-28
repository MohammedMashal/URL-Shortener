// utils/appError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // بنخلي Error class تبني الرسالة

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // علشان نعرف ده error متوقع ولا لا

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
