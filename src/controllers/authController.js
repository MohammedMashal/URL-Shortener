const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userModel = require("../models/userModel");

const Email = require("../utils/email");
const AppError = require("../utils/appError");
const generateAndSendToken = require("../utils/generateAndSendToken");

exports.signUp = asyncHandler(async (req, res, next) => {
  if (await userModel.getUserByEmail(req.body.email))
    return next(new AppError("This email is already exist", 400));
  let { name, email, password } = req.body;
  password = await bcrypt.hash(password, 12);
  const user = await userModel.createUser(name, email, password);
  const url = `${req.protocol}://${req.get("host")}/welcome`;
  await new Email(user, url).sendWelcome();
  generateAndSendToken(res, user, 201);
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.getUserByEmail(req.body.email);
  if (!user) return next(new AppError("Incorrect email or password", 401));

  if (!(await bcrypt.compare(req.body.password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  generateAndSendToken(res, user, 200);
});

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1- Get user by email
  const { email } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (!user) return next(new AppError("There is no user with this email", 404));

  // 2- if user exist, Generate random reset code and save it in db
  const passwordResetExpires = Date.now() + 10 * 60 * 1000;
  const resetCode = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  await userModel.setResetCode(hashedToken, passwordResetExpires, user.id);

  // 3 - send reset code via email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetCode}`;
  try {
    await new Email(user, resetURL).sendResetPassword();

    res.status(200).json({
      status: "success",
      message: "Reset url has sent to email",
    });
  } catch (error) {
    await userModel.setResetCode(null, null, user.id);
    return next(
      new AppError(
        "Something went wrong in sending email, Please try again later",
        500
      )
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await userModel.getUserByResetToken(hashedToken);
  if (!user)
    return next(new AppError("Reset token is invalid or has expired", 400));

  const hashedPassword = await bcrypt.hash(password, 12);
  await userModel.updatePassword(user.id, hashedPassword);

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully",
  });
});
