const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const path = require("path");
// middlewares
const filesPayloadMiddleware = require("../middlewares/filesPayloadMiddleware");
const fileLimitMiddleware = require("../middlewares/fileLimitMiddleware");
const fileExtMiddleware = require("../middlewares/fileExtMiddleware");

router.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "file-upload.html"));
});

router.post(
  "/file-upload",
  fileUpload({ createParentPath: true }),
  filesPayloadMiddleware,
  fileLimitMiddleware,
  fileExtMiddleware([".jpeg", ".jpg", ".png"]),
  (req, res) => {
    const files = req.files;

    Object.keys(files).forEach((key) => {
      const filepath = path.join(
        __dirname,
        "..",
        "wwwroot",
        "uploads",
        files[key].name
      );
      files[key].mv(filepath, (err) => {
        if (err) return res.status(500).json({ status: "error", message: err });
      });
    });

    return res.json({
      type: "success",
      message: Object.keys(files).toString(),
    });
  }
);

module.exports = router;
