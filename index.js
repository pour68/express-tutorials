// modules
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// middleware handlers
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const jwtVerifyMiddleware = require("./middlewares/jwtVerifyMiddleware");
// settings
const corsSettings = require("./settings/corsSettings");
const dbConnectionUtils = require("./utils/dbConnUtils");
// routes
const indexRoute = require("./routes/indexRoute");
const courseRoute = require("./routes/courseRoute");
const authRoute = require("./routes/authRoute");
const employeeRoute = require("./routes/api/employeeRoute");

// conenct to mangodb
dbConnectionUtils();

// manage logger
app.use(loggerMiddleware);

// manage cors
app.use(cors(corsSettings));

// manage form data
app.use(express.urlencoded({ extended: false }));

// serialize/deserialize json data
app.use(express.json());

// enable cookies
app.use(cookieParser());

// static files
app.use(express.static(path.join(__dirname, "wwwroot")));
app.use("/courses", express.static(path.join(__dirname, "wwwroot")));

// register routes
app.use("/", indexRoute);
app.use("/auth", authRoute); // auth/register|login

// jwt
app.use(jwtVerifyMiddleware);

// protected routes
app.use("/courses", courseRoute);
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
app.use(errorMiddleware);

// mangodb and server app is up and running
mongoose.connection.once("open", () => {
  console.log("mongodb is connected...");

  const PORT = process.env.PORT || 3500;
  app.listen(PORT, () =>
    console.log(`server is now up and running on http://localhost:${PORT}`)
  );
});
