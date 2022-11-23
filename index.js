// modules
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
// middleware handlers
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
// cors settings
const corsSettings = require("./settings/corsSettings");
// routes
const indexRoute = require("./routes/indexRoute");
const courseRoute = require("./routes/courseRoute");

// manage logger
app.use(loggerMiddleware);

// manage cors
app.use(cors(corsSettings));

// manage form data
app.use(express.urlencoded({ extended: false }));

// serialize/deserialize json data
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/courses", express.static(path.join(__dirname, "public")));

// register routes
app.use("/", indexRoute);
app.use("/courses", courseRoute);

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

const PORT = process.env.PORT || 3500;

app.listen(PORT, () =>
  console.log(`server is up and running http://localhost:${PORT}`)
);
