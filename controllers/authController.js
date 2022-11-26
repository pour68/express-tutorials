const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/userService");
const randomSalt = require("../utils/securityUtils");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");

const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

class AuthController {
  async register(req, res) {
    const { username, pwd } = req.body;
    const userService = new UserService();
    // check user duplication
    const getUserByUsername = userService.getByUsername(username);

    if (getUserByUsername)
      return res
        .status(409)
        .json({ level: "error", message: "user already exist." });

    try {
      const hashedPassowrd = await bcrypt.hash(pwd, 10);

      const newUser = { username, pwd: hashedPassowrd };

      const createdUser = await userService.create(newUser);

      if (createdUser) {
        return res.status(201).json({
          level: "success",
          message: `user with username ${username} created.`,
        });
      } else {
        return res.status(500).json({
          level: "error",
          message: `db error.`,
        });
      }
    } catch (err) {
      res.status(500).json({ level: "error", message: err.message });
    }
  }

  async login(req, res) {
    const { username, pwd } = req.body;

    const userService = new UserService();

    const foundUser = userService.getByUsername(username);

    if (!foundUser)
      return res
        .status(401)
        .json({ level: "error", message: "user not registered." });

    const match = await bcrypt.compare(pwd, foundUser.pwd);

    if (match) {
      // jwt
      const accessToken = generateAccessToken(foundUser.username, "15m");
      const refreshToken = generateRefreshToken(foundUser.username, "1d");

      const otherUsers = userService.getOtherUsers(foundUser.username);
      const currentUser = { ...foundUser, refreshToken };

      await userService.saveUser(otherUsers, currentUser);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 86_400_000,
      });

      res.json({
        level: "success",
        message: `user ${foundUser.username} is logged in`,
        accessToken,
      });
    } else {
      res.status(401).json({
        level: "error",
        message: `login failed`,
      });
    }
  }

  refreshToken(req, res) {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401); // unauthories

    const refreshToken = cookies.jwt;

    const userService = new UserService();
    const foundUser = userService.getByRefreshToken(refreshToken);

    if (!foundUser) return res.sendStatus(403); // forbidden

    // jwt evaluation
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403); // forbidden

        const accessToken = generateAccessToken(decoded.username, "15m");

        res.json({ accessToken });
      }
    );
  }

  async logout(req, res) {
    // delete accessToken on client

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); // no content

    const refreshToken = cookies.jwt;

    const userService = new UserService();

    const foundUser = userService.getByRefreshToken(refreshToken);

    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.status(403);
    }

    const otherUsers = userService.getOtherUsersByRefreshToken(
      foundUser.refreshToken
    );

    const currentUser = { ...foundUser, refreshToken: "" };

    await userService.saveUser(otherUsers, currentUser);

    res.clearCookie("jwt", { httpOnly: true }); // secure: true for https, sameSite: "None" and maxAge: 24*60*60*1000
    return res.sendStatus(204);
  }
}

module.exports = AuthController;
