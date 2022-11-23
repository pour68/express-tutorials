const loggerEvent = require("./loggerMiddleware");

const errorHandler = (err, req, res, next) => {
  loggerEvent.emit("log", `${err.name} ${err.message}`, "error.txt");

  console.log(err.stack);

  res.status(500).send(err.message);
};

module.exports = errorHandler;
