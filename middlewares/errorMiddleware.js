const LoggerEvent = require("../events/loggerEvent");

const loggerEvent = new LoggerEvent();

// create event
loggerEvent.on("error", (msg, filename) => {
  loggerEvent.log(msg, filename);
});

const errorHandler = (err, req, res, next) => {
  loggerEvent.emit("error", `${err.name} ${err.message}`, "error.txt");

  console.log(err.stack);

  res.status(500).send(err.message);
};

module.exports = errorHandler;
