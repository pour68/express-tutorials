const EmployeeModel = require("../../models/Employee");
const Joi = require("joi");

const schema = Joi.object({
  id: Joi.string(),
  firstname: Joi.string().min(3).required(),
  lastname: Joi.string().min(3),
});

class EmployeeService {
  constructor() {
    this.employees = EmployeeModel;
  }

  async getAll() {
    return await this.employees.find();
  }

  async getById(id) {
    return await this.employees.findOne({ _id: id }).exec();
  }

  async create(employee) {
    return await this.employees.create(employee);
  }

  async update(id, employee) {
    const foundEmployee = await this.getById(id);

    foundEmployee.firstname = employee.firstname;
    foundEmployee.lastname = employee.lastname;

    return await foundEmployee.save();
  }

  async remove(id) {
    const foundEmployee = await this.getById(id);

    return await foundEmployee.deleteOne({ _id: id });
  }

  validateEmployee(employee) {
    const { error } = schema.validate(employee);
    return error;
  }
}

module.exports = EmployeeService;
