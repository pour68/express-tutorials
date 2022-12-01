const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (payload, time) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: time,
  });

const generateRefreshToken = (payload, time) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: time,
  });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
