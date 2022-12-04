const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/mangodb/userService");
const randomSalt = require("../utils/securityUtils");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");

class AuthController {
  async register(req, res) {
    const { username, pwd } = req.body;

    if (!username || !pwd)
      return res.status(400).json({
        level: "error",
        message: "please enter valid username/password.",
      });

    const userService = new UserService();
    // check user duplication
    const foundUser = await userService.getByUsername(username);
    if (foundUser)
      return res
        .status(409)
        .json({ type: "error", message: "user already exist." });

    try {
      const randomValue = randomSalt(10);
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
    const cookies = req.cookies;
    const { username, pwd } = req.body;

    const userService = new UserService();
    const foundUser = await userService.getByUsername(username);

    if (!foundUser)
      return res
        .status(401)
        .json({ type: "error", message: "user not registered." });

    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
      // jwt
      const roles = Object.values(foundUser.roles);
      const payload = { roles, username: foundUser.username };
      const accessToken = generateAccessToken(payload, "15m");
      const newRefreshToken = generateRefreshToken(payload, "1d");

      let newRefreshTokenList = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        /*
            01. user login and never logout
            02. rt is stolen
            03. if 1 and 2 happen, remove all refresh tokens
        */
        const refreshToken = cookies.jwt;
        const foundUserByToken = await userService.getByRefreshToken(
          refreshToken
        );

        // detect refresh token reuse
        if (!foundUserByToken) newRefreshTokenList = []; // clear all refresh tokens

        res.clearCookie("jwt", { httpOnly: true });
      }

      /* mangodb */
      foundUser.refreshToken = [...newRefreshTokenList, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
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
    // step 1: get cookie from client
    const cookies = req.cookies;

    // step 2: if cookie or jwt prop not exist
    if (!cookies?.jwt) return res.sendStatus(401); // unauthorized

    // step 3: if cookie and jwt exist get jwt prop
    const refreshToken = cookies.jwt;

    // step 4: remove jwt cookie from client machine
    res.clearCookie("jwt", { httpOnly: true });

    const userService = new UserService();
    const foundUser = await userService.getByRefreshToken(refreshToken);

    // step 5: detected refresh token reuse
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.sendStatus(403); // forbidden

          const hackedUser = await userService.getByUsername(decoded.username);
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
        }
      );

      return res.sendStatus(403); // forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    // jwt evaluation
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          foundUser.refreshToken = [...newRefreshTokenArray];
          const result = await foundUser.save();
        }
        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403); // forbidden

        // refresh token is still valid
        const roles = Object.values(foundUser.roles);
        const payload = { roles, username: foundUser.username };
        const accessToken = generateAccessToken(payload, "15m");
        const newRefreshToken = generateRefreshToken(payload, "1d");

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          maxAge: 86_400_000,
        });

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
    const foundUser = await userService.getByRefreshToken(refreshToken);
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.status(403);
    }

    foundUser.refreshToken = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );
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
