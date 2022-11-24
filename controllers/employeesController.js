const employees = require("../data/employees.json");

class EmployeesController {
  getAllEmployees(req, res) {
    return res.json(employees);
  }

  createNewEmployee(req, res) {
    return res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  }

  updateEmployee(req, res) {
    return res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  }

  getEmployeeById(req, res) {
    const employee = employees.find((e) => e.id === parseInt(req.params.id));

    return res.json(employee);
  }

  deleteEmployee(req, res) {
    return res.json({
      id: req.params.id,
    });
  }
}

module.exports = EmployeesController;
