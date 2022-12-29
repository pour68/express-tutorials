const LoggerEvent = require("../events/loggerEvent");

const loggerEvent = new LoggerEvent();

// create event
loggerEvent.on("log", (msg, filename) => {
  loggerEvent.log(msg, filename);
});

const loggerHandler = (req, res, next) => {
  // trigger event
  loggerEvent.emit(
    "log",
    `${req.method} ${req.headers.origin} ${req.url}`,
    "log.txt"
  );

  next();
};

module.exports = loggerHandler;
