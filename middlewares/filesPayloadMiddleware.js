const filesPayloadHandler = (req, res, next) => {
  if (!req.files)
    return res.status(400).json({ type: "error", message: "missing files" });

  next();
};

module.exports = filesPayloadHandler;
