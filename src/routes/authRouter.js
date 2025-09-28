const express = require("express");

const authController = require("../controllers/authController");
const authValidator = require("../utils/validation/authValidator");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               passwordConfirm: { type: string }
 *     responses:
 *       201: { description: User created successfully }
 *       400: { description: Email already exists }
 */
router.post("/signup", authValidator.signUpValidator, authController.signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: User logged in successfully }
 *       401: { description: Incorrect email or password }
 */
router.post("/login", authValidator.loginValidator, authController.login);

/**
 * @swagger
 * /auth/forgetPassword:
 *   post:
 *     summary: Send reset password email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: Reset URL sent to email }
 *       404: { description: No user with this email }
 */
router.post(
  "/forgetPassword",
  authValidator.forgetPasswordValidator,
  authController.forgetPassword
);

/**
 * @swagger
 * /auth/resetPassword/{code}:
 *   patch:
 *     summary: Reset password using reset code
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - passwordConfirm
 *             properties:
 *               password: { type: string }
 *               passwordConfirm: { type: string }
 *     responses:
 *       200: { description: Password has been reset successfully }
 *       400: { description: Reset token invalid or passwords do not match }
 */
router.patch(
  "/resetPassword/:resetCode",
  authValidator.resetPasswordValidator,
  authController.resetPassword
);

module.exports = router;
