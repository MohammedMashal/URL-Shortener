const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");
const AppError = require("../utils/appError");

exports.protect = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("Not authorized, no token", 401));
  }
  const token = req.headers.authorization.split(" ")[1];

  const { userId, iat } = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await userModel.getUserById(userId);
  if (!currentUser)
    return next(
      new AppError(
        "The user that belongs to this token does no longer exist",
        401
      )
    );

  if (parseInt(currentUser.password_changed_at.getTime() / 1000, 10) > iat)
    return next(
      new AppError(
        "User recently has changed his password, Please log in again",
        401
      )
    );

  req.user = currentUser;
  next();
});
