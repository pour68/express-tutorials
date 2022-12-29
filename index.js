// modules
const path = require("path"); // ok
const express = require("express"); // ok
const app = express(); // ok
const cors = require("cors"); // ok
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// middleware handlers
const loggerMiddleware = require("./middlewares/loggerMiddleware"); // ok
const errorMiddleware = require("./middlewares/errorMiddleware"); // ok
const jwtVerifyMiddleware = require("./middlewares/jwtVerifyMiddleware");
// settings
const corsSetting = require("./settings/corsSetting");
// utils
const dbConnectionUtil = require("./utils/dbConnUtil");
// routes
const indexRoute = require("./routes/indexRoute");
const courseRoute = require("./routes/courseRoute");
const fileUploadRoute = require("./routes/fileUploadRoute");
const authRoute = require("./routes/authRoute");
const employeeRoute = require("./routes/api/employeeRoute");

// conenct to mangodb
// dbConnectionUtil();

// manage logger
app.use(loggerMiddleware); // ok

// manage cors
app.use(cors(corsSetting)); // { extends: false } and more details

// manage form data
app.use(express.urlencoded({ extended: false })); // ok

// serialize/deserialize json data
app.use(express.json()); // ok

// enable cookies
app.use(cookieParser());

// static files
app.use(express.static(path.join(__dirname, "wwwroot"))); // ok
app.use("/courses", express.static(path.join(__dirname, "wwwroot"))); // ok

// register routes
app.use("/", indexRoute); // ok
app.use("/courses", courseRoute); // ok
app.use("/files", fileUploadRoute);
app.use("/auth", authRoute); // ok

// jwt
app.use(jwtVerifyMiddleware);

// protected routes
app.use("/api/employees", employeeRoute);

// manage 404 page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// manage error logger
app.use(errorMiddleware); // ok

// mangodb and server app is up and running
// mongoose.connection.once("open", () => {
//   console.log("mongodb is connected...");

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server is now up and running on http://localhost:${PORT}`));
// });
