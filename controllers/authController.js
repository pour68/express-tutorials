const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/mangodb/userService");
const randomSalt = require("../utils/securityUtils");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwtUtils");

class AuthController {
  async register(req, res) {
    const { username, pwd } = req.body;

    if (!username || !pwd)
      return res.status(400).json({
        type: "error",
        message: "please enter valid username/password.",
      });

    const userService = new UserService();
    // check user duplication
    const foundUser = await userService.getByUsername(username);
    if (foundUser) return res.status(409).json({ type: "error", message: "user already exist." });

    try {
      const randomValue = randomSalt(100);
      const hashedPassowrd = await bcrypt.hash(pwd, randomValue);

      const newUser = { username, pwd: hashedPassowrd };

      const createdUser = await userService.create(newUser);

      if (createdUser) {
        // success
        return res.status(201).json({
          type: "success",
          message: `user with username ${username} created.`,
        });
      } else {
        // failed: technical issues like connection, ...
        return res.status(500).json({
          type: "error",
          message: `db error.`,
        });
      }
    } catch (err) {
      // failed: db error
      res.status(500).json({ type: "error", message: err.message });
    }
  }

  async login(req, res) {
    const { username, pwd } = req.body;

    const userService = new UserService();
    const foundUser = await userService.getByUsername(username);
    if (!foundUser) return res.status(401).json({ type: "error", message: "user not registered." }); // unauthorized

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      // jwt
      const roles = Object.values(foundUser.roles);
      const payload = { roles, username: foundUser.username };
      const accessToken = generateAccessToken(payload, "15m");
      const refreshToken = generateRefreshToken(payload, "1d");

      /* mangodb */
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      /* file as database */
      // const otherUsers = userService.getOtherUsers(foundUser.username);
      // const currentUser = { ...foundUser, refreshToken };
      // await userService.saveUser(otherUsers, currentUser);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 86_400_000,
      });

      res.json({
        type: "success",
        message: `user ${foundUser.username} successfully logged in`,
        accessToken,
      });
    } else {
      res.status(401).json({
        type: "error",
        message: `login failed`,
      });
    }
  }

  async refreshToken(req, res) {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401); // unauthorized

    const refreshToken = cookies.jwt;

    const userService = new UserService();
    const foundUser = await userService.getByRefreshToken(refreshToken);
    if (!foundUser) return res.sendStatus(403); // forbidden

    // jwt evaluation
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // forbidden

      const roles = Object.values(foundUser.roles);
      const payload = { roles, username: foundUser.username };
      const accessToken = generateAccessToken(payload, "15m");

      res.json({ accessToken });
    });
  }

  async logout(req, res) {
    // delete accessToken on client

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); // no content

    const refreshToken = cookies.jwt;

    const userService = new UserService();
    const foundUser = await userService.getByRefreshToken(refreshToken);
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.status(403);
    }

    /* file as database */
    // const otherUsers = userService.getOtherUsersByRefreshToken(
    //   foundUser.refreshToken
    // );
    // const currentUser = { ...foundUser, refreshToken: "" };
    // await userService.saveUser(otherUsers, currentUser);

    /* mangodb */
    foundUser.refreshToken = "";
    const result = await foundUser.save();

    // failed: technical issues like connection, ...
    if (!result)
      return res.status(400).json({
        type: "error",
        message: "user logout failed.",
      });

    res.clearCookie("jwt", { httpOnly: true }); // secure: true for https, sameSite: "None" and maxAge: 24*60*60*1000
    return res.sendStatus(204);
  }
}

module.exports = AuthController;
