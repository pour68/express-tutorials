const express = require("express");
const router = express.Router();
const EmployeesController = require("../../controllers/employeesController");

const employeesController = new EmployeesController();

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee);

router
  .route("/:id")
  .get(employeesController.getEmployeeById)
  .delete(employeesController.deleteEmployee);

module.exports = router;
