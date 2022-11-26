const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (username, time) =>
  jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: time,
  });

const generateRefreshToken = (username, time) =>
  jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: time,
  });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
