const MAX_SIZE = 5;
const MAX_FILE_SIZE = MAX_SIZE * 1024 * 1024;

const fileLimitHandler = (req, res, next) => {
  const files = req.files;

  const filesOverLimit = [];

  Object.keys(files).forEach((key) => {
    if (files[key].size > MAX_FILE_SIZE) {
      filesOverLimit.push(files[key].name);
    }
  });

  if (filesOverLimit.length > 0) {
    const properVerv = filesOverLimit.length > 1 ? "are" : "is";

    const sentence =
      `upload failed. ${filesOverLimit.toString()} ${properVerv} over the file size limit of ${MAX_SIZE}MB.`.replace(
        /,/gi,
        ", "
      );

    const message =
      filesOverLimit.length < 3
        ? sentence.replace(",", " and")
        : sentence.replace(/,(?=[^,]*$)/, " and");

    return res.status(413).json({ type: "error", message });
  }

  next();
};

module.exports = fileLimitHandler;
