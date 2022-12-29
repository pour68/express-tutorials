const express = require("express");
const router = express.Router();
const EmployeesController = require("../../controllers/employeesController");
const roles = require("../../settings/rolesSetting");
const verifyRolesMiddleware = require("../../middlewares/verifyRolesMiddleware");

const employeesController = new EmployeesController();

router
  .route("/")
  .get(employeesController.getAll)
  .post(verifyRolesMiddleware(roles.Admin, roles.Editor), employeesController.create);

router
  .route("/:id")
  .get(employeesController.getById)
  .delete(verifyRolesMiddleware(roles.Admin), employeesController.delete)
  .put(verifyRolesMiddleware(roles.Admin, roles.Editor), employeesController.update);

module.exports = router;
