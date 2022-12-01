const express = require("express");
const router = express.Router();
const EmployeesController = require("../../controllers/employeesController");
const roles = require("../../settings/rolesSetting");
const verifyRolesMiddleware = require("../../middlewares/verifyRolesMiddleware");

const employeesController = new EmployeesController();

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRolesMiddleware(roles.Admin, roles.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRolesMiddleware(roles.Admin, roles.Editor),
    employeesController.updateEmployee
  );

router
  .route("/:id")
  .get(employeesController.getEmployeeById)
  .delete(
    verifyRolesMiddleware(roles.Admin),
    employeesController.deleteEmployee
  );

module.exports = router;
