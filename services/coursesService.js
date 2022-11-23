const courses = require("../data/courses.json");
const Joi = require("joi");

const schema = Joi.object({
  id: Joi.number(),
  title: Joi.string().min(3).required(),
  author: Joi.string().min(3).required(),
});

class CourseService {
  constructor() {
    this.courses = courses;
  }

  getAll() {
    if (this.courses.length === 0)
      return { level: "info", message: "no record found." };

    return this.courses;
  }

  getById(id) {
    const course = this.courses.find((c) => c.id === parseInt(id));

    if (!course) return { level: "error", message: "course not found." };

    return course;
  }

  create(course) {
    const newCourse = {
      id: this.courses.length + 1,
      title: course.title,
      author: course.author,
    };

    const error = this.#validateCourse(course);
    if (error) return error.details[0].message;

    this.courses.push(newCourse);

    return newCourse;
  }

  update(id, course) {
    const courseId = parseInt(id);

    if (courseId !== course.id)
      return { level: "error", message: "bad request." };

    const error = this.#validateCourse(course);
    if (error) return error.details[0].message;

    const foundCourse = this.getById(courseId);
    foundCourse.title = course.title;
    foundCourse.author = course.author;

    return foundCourse;
  }

  remove(id) {
    const foundCourse = this.getById(parseInt(id));

    const index = this.courses.indexOf(foundCourse);
    if (index === -1) return { level: "error", message: "course not found." };

    this.courses.splice(index, 1);

    return this.courses;
  }

  #validateCourse(course) {
    const { error } = schema.validate(course);
    return error;
  }
}

module.exports = CourseService;
