# Express

## History

- founder
- birthdate
- story: created on the top of http module/package.
- goals

## What is Express.js?

a node module/package to create restful api.

## Setting up development environment

- Install node.js
- Editor: vscode - atom - sublime text - bracket - vim
- npm install express

## basic server setup

npm i express

const express = require("express");
const app = express();
app.use(express.json());

app.get();

example: app.get("/", (req, res) => { res.send("...") })
example: app.get("/api/courses", (req, res) => { res.send([1,2,3]) })
example: app.get("/api/courses/:id", (req, res) => { req.params.id })
example: app.get("/api/post/:year/:month", (req, res) => { req.params.year })
example: app.get("/api/post/:year/:month?orderBy=name", (req, res) => { req.query })
example: app.get("/api/courses/:id", (req, res) => { res.status(404).send("..."); })

app.post();

example: app.post("/api/courses", (req, res) => { req.body.name })

app.put();

example: app.put("/api/courses/:id", (req, res) => { req.body.name });

app.delete();

example: app.delete("/api/courses/:id", (req, res) => { req.patams.id });

app.send();
app.sendFile(path, options, callback);
app.sendFile(path);
app.redirect(statusCode = 302, relativePath);

app.listen(port, callback);
example:
const PORT = process.env.PORT || 3500;
app.listen(3000, () => {});

## middlewares

it's a piece of software that execute between request and response.

app.use(express.json()): serialized/deserialized data.
app.use(express.urlencoded({ extended: false })): accept form data.
app.use(express.static(path.join(__dirname, "public"))): load static files.

### custom middleware

app.use((req, res, next) => {
    // logic
    next();
});

### middleware module/package

npm i cors

## routes
