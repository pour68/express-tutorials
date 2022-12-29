const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload, publicToken, time) =>
  jwt.sign(payload, publicToken, {
    expiresIn: time,
  });

const generateAccessToken = (payload, time) =>
  generateToken(payload, process.env.ACCESS_TOKEN_SECRET, time);

const generateRefreshToken = (payload, time) =>
  generateToken(payload, process.env.REFRESH_TOKEN_SECRET, time);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
