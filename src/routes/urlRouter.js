const express = require("express");

const urlController = require("../controllers/urlController");
const urlValidator = require("../utils/validation/urlValidator");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: URL
 *   description: URL shortening endpoints
 */

/**
 * @swagger
 * /url/{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URL]
 *     parameters:
 *       - name: shortCode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302: { description: Redirecting to original URL }
 *       404: { description: Short code not found }
 */
router.get(
  "/:shortCode",
  urlValidator.getOriginalUrl,
  urlController.getOriginalUrl
);

router.use(protect);

/**
 * @swagger
 * /url:
 *   post:
 *     summary: Create a short URL
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl: { type: string }
 *     responses:
 *       201: { description: Short URL created successfully }
 *       400: { description: Invalid URL }
 */

/**
 * @swagger
 * /url:
 *   get:
 *     summary: Get all URLs for logged-in user
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of URLs }
 */
router
  .route("/")
  .post(urlValidator.createShortUrl, urlController.createShortUrl)
  .get(urlController.getUserUrls);

/**
 * @swagger
 * /url/{id}:
 *   delete:
 *     summary: Delete a short URL by ID
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204: { description: URL deleted successfully }
 *       404: { description: URL not found }
 */
router.delete("/:id", urlValidator.deleteUrl, urlController.deleteUrl);

module.exports = router;
