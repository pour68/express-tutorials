const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWTHandler = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) res.sendStatus(403);
    req.username = decoded.username;
    req.roles = decoded.roles;
    next();
  });
};

module.exports = verifyJWTHandler;
