const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh-token", authController.refreshToken);
router.get("/logout", authController.logout);

module.exports = router;
