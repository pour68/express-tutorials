# Express

## History

- founder: TJ Holowaychuk, StrongLoop and others
- birthdate: 16 November 2010
- story: created on the top of http module/package
- goals: create and manage restapi and microservices

## What is Express.js?

a node module/package to create restful api/microservices.

## Setting up development environment

- Install node.js
- Editor: vscode - atom - sublime text - bracket - vim
- npm install express

## Basic server setup

npm i express

const express = require("express");
const app = express();
app.use(express.json());

app.get(routeAddress, callback);

example: app.get("/", (req, res) => { res.send("...") })
example: app.get("/api/courses", (req, res) => { res.send([1,2,3]) })
example: app.get("/api/courses/:id", (req, res) => { req.params.id })
example: app.get("/api/posts/:year/:month", (req, res) => { req.params.year })
example: app.get("/api/posts/:year/:month?orderBy=name", (req, res) => { req.query })
example: app.get("/api/courses/:id", (req, res) => { res.status(404).send("..."); })

app.post(routeAddress, callback);

example: app.post("/api/courses", (req, res) => { req.body.name })

Note: 201 as an status code.

app.put(routeAddress, callback);

example: app.put("/api/courses/:id", (req, res) => { req.body.name });

app.delete(routeAddress, callback);

example: app.delete("/api/courses/:id", (req, res) => { req.params.id });

app.send();
app.sendFile(path, options, callback);
app.sendFile(path);
app.redirect(statusCode = 302, relativePath);

app.listen(port, callback);
example:
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {});

## Middlewares

it's a piece of software that execute between request and response.

app.use(express.json()): serialized/deserialized data.
app.use(express.urlencoded({ extended: false })): accept form data.
app.use(express.static(path.join(__dirname, "public"))): load static files.

### Custom middleware

app.use((req, res, next) => {
    // logic
    next();
});

### Middleware module/package

npm i cors

## Routes

## Models

## Controllers

## Views

## bcryprt module/package

npm i bcrypt

## dotenv module/package

npm i dotenv

## jsonwebtoken module/package

npm i jsonwebtoken

## cookie-parser

npm i cookie-parser

## generate random crypto

- command prompt > node > press enter
- require("crypto").randomBytes(64).toString("hex")

## mangoose module/package

npm i mongoose
