const fsPromises = require("fs").promises;
const path = require("path");
const Joi = require("joi");

const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

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
    this.users = usersDB.users;
  }

  getAll() {
    if (this.users.length === 0)
      return { level: "info", message: "no record found." };

    return this.users;
  }

  getById(id) {
    const user = this.users.find((c) => c.id === parseInt(id));

    if (!user) return { level: "error", message: "course not found." };

    return user;
  }

  getByUsername(username) {
    return this.users.find((c) => c.username === username);
  }

  getByRefreshToken(refreshToken) {
    return this.users.find((c) => c.refreshToken === refreshToken);
  }

  async create(user) {
    const newUser = {
      id: this.users.length + 1,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      pwd: user.pwd,
    };

    const error = this.#validateUser(user);
    if (error) return error.details[0].message;

    await this.saveUser(usersDB.users, newUser);

    return newUser;
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

  async saveUser(users, user) {
    usersDB.setUsers([...users, user]);

    await this.saveInFile("users.json", usersDB.users);
  }

  async saveInFile(fileName, data) {
    await fsPromises.writeFile(
      path.join(__dirname, "../", "data", fileName),
      JSON.stringify(data)
    );
  }

  #validateUser(user) {
    const { error } = schema.validate(user);
    return error;
  }
}

module.exports = UserService;
