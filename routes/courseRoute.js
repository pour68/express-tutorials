const express = require("express");
const router = express.Router();
const path = require("path");

// serve static files

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "courses", "index.html"));
});

router.get("/course(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "courses", "course.html"));
});

module.exports = router;
