const UserModel = require("../../models/User");
const Joi = require("joi");

const schema = Joi.object({
  id: Joi.number(),
  username: Joi.string().min(3).required(),
  email: Joi.string().min(5),
  phoneNumber: Joi.string().equal(11),
  token: Joi.string().equal(4),
  pwd: Joi.string().min(6).required(),
});

class UserService {
  constructor() {
    this.users = UserModel;
  }

  getAll() {
    return this.users.find();
  }

  async getById(id) {
    return await this.users.findOne({ id }).exec();
  }

  async getByUsername(username) {
    return await this.users.findOne({ username }).exec();
  }

  async getByRefreshToken(refreshToken) {
    return await this.users.findOne({ refreshToken }).exec();
  }

  async create(user) {
    const newUser = {
      username: user.username,
      password: user.pwd,
    };

    const error = this.#validateUser(user);
    if (error) return error.details[0].message;

    const result = await this.users.create(newUser);
    return result;
  }

  update(id, user) {
    const userId = parseInt(id);

    if (userId !== user.id) return { level: "error", message: "bad request." };

    const error = this.#validateUser(user);
    if (error) return error.details[0].message;

    const foundUser = this.getById(userId);
    foundUser.username = user.username;
    foundUser.email = user.email;
    foundUser.phoneNumber = user.phoneNumber;
    foundUser.pwd = user.pwd;

    return foundUser;
  }

  remove(id) {
    const foundUser = this.getById(parseInt(id));

    const index = this.users.indexOf(foundUser);
    if (index === -1) return { level: "error", message: "user not found." };

    this.users.splice(index, 1);

    return this.users;
  }

  getOtherUsers(username) {
    return this.users.filter((u) => u.username !== username);
  }

  getOtherUsersByRefreshToken(refreshToken) {
    return this.users.filter((u) => u.refreshToken !== refreshToken);
  }

  #validateUser(user) {
    const { error } = schema.validate(user);
    return error;
  }
}

module.exports = UserService;
