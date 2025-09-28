const { check } = require("express-validator");

const {
  validatorController,
} = require("../../controllers/validatorController");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name can't be empty.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters."),
  check("email")
    .notEmpty()
    .withMessage("Email can't be empty.")
    .bail()
    .isEmail()
    .withMessage("Invalid email address."),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm can't be empty."),
  check("password")
    .notEmpty()
    .withMessage("Password can't be empty.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .custom((password, { req }) => {
      if (req.body.passwordConfirm !== password) {
        throw new Error("Password and passwordConfirm are not the same.");
      }
      return true;
    }),
  validatorController,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email can't be empty.")
    .bail()
    .isEmail()
    .withMessage("Invalid email address."),
  check("password")
    .notEmpty()
    .withMessage("Password can't be empty.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
  validatorController,
];

exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email can't be empty.")
    .bail()
    .isEmail()
    .withMessage("Invalid email address."),
  validatorController,
];

exports.resetPasswordValidator = [
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm can't be empty."),
  check("password")
    .notEmpty()
    .withMessage("Password can't be empty.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .custom((password, { req }) => {
      if (req.body.passwordConfirm !== password) {
        throw new Error("Password and Password Confirm are not the same.");
      }
      return true;
    }),
  validatorController,
];
