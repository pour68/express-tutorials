const EmployeeService = require("../services/mangodb/employeeService");

class EmployeesController {
  async getAllEmployees(req, res) {
    const employeeService = new EmployeeService();
    try {
      // success
      const employees = await employeeService.getAll();

      return res.status(200).json(employees);
    } catch (err) {
      // failed: db error
      return res.status(500).json({
        type: "error",
        message: err.message,
      });
    }
  }

  async getEmployeeById(req, res) {
    const { id } = req.params;

    const employeeService = new EmployeeService();
    const employee = await employeeService.getById(id);

    if (!employee)
      return res.status(404).json({
        type: "error",
        message: `not found employee with id = ${id}.`,
      });

    return res.status(200).json(employee);
  }

  async createNewEmployee(req, res) {
    if (!req?.body) return res.sendStatus(400);

    const { firstname, lastname } = req.body;
    const employee = { firstname, lastname };

    const employeeService = new EmployeeService();
    // data validation
    const error = employeeService.validateEmployee(employee);
    if (error)
      return res.status(400).json({
        type: "error",
        message: error.details[0].message,
      });

    try {
      const result = await employeeService.create(employee);

      // failed: technical issues like connection, ...
      if (!result)
        return res.status(400).json({
          type: "error",
          message: "database failed to record new employee.",
        });

      // success
      return res.status(201).json({
        type: "success",
        message: "employee successfully created.",
      });
    } catch (err) {
      // failed: db error
      return res.status(500).json({
        type: "error",
        message: err.message,
      });
    }
  }

  async updateEmployee(req, res) {
    if (!req?.body || !req?.params?.id) return res.sendStatus(400);
    if (req.body.id !== req.params.id) return res.sendStatus(400);

    const { id } = req.params;
    const { firstname, lastname } = req.body;
    const employee = { id: req.body.id, firstname, lastname };

    const employeeService = new EmployeeService();
    // data validation
    const error = employeeService.validateEmployee(employee);
    if (error)
      return res.status(400).json({
        type: "error",
        message: error.details[0].message,
      });

    try {
      const result = await employeeService.update(id, employee);

      // failed: technical issues like connection, ...
      if (!result)
        return res.status(400).json({
          type: "error",
          message: "database failed to record new employee.",
        });

      // success
      return res.status(204).json({
        type: "success",
        message: `employee with id = ${id} successfully updated.`,
      });
    } catch (err) {
      // failed: db error
      return res.status(500).json({
        type: "error",
        message: err.message,
      });
    }
  }

  async deleteEmployee(req, res) {
    if (!req?.params?.id) return res.sendStatus(400);

    const { id } = req.params;

    try {
      const employeeService = new EmployeeService();
      const result = await employeeService.remove(id);

      // failed: technical issues like connection, ...
      if (!result)
        return res.status(400).json({
          type: "error",
          message: `database failed to delete employee with id = ${id}.`,
        });

      // success
      return res.status(200).json({
        type: "success",
        message: `employee with id = ${id} successfully deleted.`,
      });
    } catch (err) {
      // failed: db error
      return res.status(500).json({
        type: "error",
        message: err.message,
      });
    }
  }
}

module.exports = EmployeesController;
