const { check, param } = require("express-validator");

const {
  validatorController,
} = require("../../controllers/validatorController");

exports.createShortUrl = [
  check("originalUrl")
    .notEmpty()
    .withMessage("originalUrl field can't be empty")
    .bail()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage("Invalid Url"),
  validatorController,
];

exports.getOriginalUrl = [
  param("shortCode")
    .notEmpty()
    .withMessage("shortCode param can't be empty")
    .bail()
    .isLength({ min: 8, max: 8 })
    .withMessage("shortCode must be exactly 8"),
  validatorController,
];

exports.deleteUrl = [
  param("id").notEmpty().withMessage("id field can't be empty").bail(),
  validatorController,
];
