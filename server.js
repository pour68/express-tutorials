// const express = require("express");
// const app = express();

// const CourseService = require("./services/coursesService");

// app.use(express.json());

// app.get("/api/courses", (req, res) => {
//   const courseService = new CourseService();
//   return res.send(courseService.getAll());
// });

// app.get("/api/courses/:id", (req, res) => {
//   const courseService = new CourseService();
//   return res.send(courseService.getById(req.params.id));
// });

// app.post("/api/courses", (req, res) => {
//   const course = { title: req.body.title, author: req.body.author };

//   const courseService = new CourseService();
//   let createdCourse = courseService.create(course);

//   console.log("create");

//   return res.send(createdCourse);
// });

// app.put("/api/courses/:id", (req, res) => {
//   const course = {
//     id: req.body.id,
//     title: req.body.title,
//     author: req.body.author,
//   };

//   const courseService = new CourseService();
//   let updatedCourse = courseService.update(req.params.id, course);

//   return res.send(updatedCourse);
// });

// app.delete("/api/courses/:id", (req, res) => {
//   const courseService = new CourseService();
//   const courses = courseService.remove(req.params.id);

//   return res.send(courses);
// });

// const PORT = process.env.PORT || 3500;

// app.listen(PORT, () => {
//   console.log(`server is up and running http://localhost:${PORT}`);
// });

// route handlers
// app.get(
//   "/test(.html)?",
//   (req, res, next) => {
//     console.log("test page");
//     next();
//   },
//   (req, res) => {
//     res.send("test finalized");
//   }
// );

// // chain route handlers
// const one = (req, res, next) => {
//   console.log("one");
//   next();
// };
// const two = (req, res, next) => {
//   console.log("two");
//   next();
// };
// const three = (req, res) => {
//   console.log("three");
//   res.send("three");
// };

// app.get("/chain(.html)?", [one, two, three]);
