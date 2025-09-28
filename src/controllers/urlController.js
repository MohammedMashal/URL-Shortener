const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const urlModel = require("../models/urlModel");
const AppError = require("../utils/appError");

const generateShortCode = async () => {
  let code, url;
  do {
    code = crypto.randomBytes(4).toString("hex");
    url = await urlModel.getUrlByShortCode(code);
  } while (url);
  return code;
};

exports.createShortUrl = asyncHandler(async (req, res, next) => {
  const { originalUrl } = req.body;
  const shortCode = await generateShortCode();
  await urlModel.createUrl(originalUrl, shortCode, req.user.id);
  const shortUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/urls/${shortCode}`;

  res.status(201).json({
    status: "success",
    data: {
      shortUrl,
      originalUrl,
    },
  });
});

exports.getOriginalUrl = asyncHandler(async (req, res, next) => {
  const { shortCode } = req.params;
  console.log(shortCode);
  const url = await urlModel.getUrlByShortCode(shortCode);
  if (!url) return next(new AppError("Can't find this short code", 404));
  res.redirect(url.original_url);
});

exports.getUserUrls = asyncHandler(async (req, res, next) => {
  const urls = await urlModel.getUrlsByUser(req.user.id);
  res.status(200).json({
    status: "success",
    dataLength: urls.length,
    data: { urls },
  });
});

exports.deleteUrl = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!(await urlModel.deleteUrl(id, req.user.id)))
    return next(new AppError("There is no url with this id", 404));
  res.status(204).send();
});
