const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const EventEmitter = require("events");

class LoggerEvent extends EventEmitter {
  constructor() {
    super();

    this.currentDateTime = this.#formatDateTime();
    this.uniqueId = this.#generateUniqueId();
  }

  async log(msg, fileName = "log.txt") {
    const logRecord = this.#logRecord(msg);

    try {
      let relativePath = path.join(__dirname, "..", "logs");

      if (!fs.existsSync(relativePath)) {
        await fsPromises.mkdir(relativePath);
      }

      await fsPromises.appendFile(
        path.join(__dirname, "..", "logs", fileName),
        logRecord
      );
    } catch (err) {
      console.error(err);
    }
  }

  #logRecord(msg) {
    return `${this.currentDateTime} \t ${this.uniqueId} \t ${msg} \n`;
  }

  #formatDateTime() {
    return format(new Date(), "yyyy/MM/dd-HH:mm:ss");
  }

  #generateUniqueId() {
    return uuid();
  }
}

const loggerEvent = new LoggerEvent();

// create event
loggerEvent.on("log", (msg, filename) => {
  loggerEvent.log(msg, filename);
});

const loggerHandler = (req, res, next) => {
  loggerEvent.emit(
    "log",
    `${req.method} ${req.headers.origin} ${req.url}`,
    "log.txt"
  );
  next();
};

module.exports = loggerHandler;
