const jwt = require("jsonwebtoken");

module.exports = (res, user, statusCode) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    },
  });
};
