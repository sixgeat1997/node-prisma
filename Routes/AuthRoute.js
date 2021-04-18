const express = require("express");

const AuthController = require("../Controllers/AuthController");

const authRoute = express.Router();

authRoute.post("/login", AuthController.login);
authRoute.post("/signup", AuthController.signup);
authRoute.put("/resetpassword", AuthController.resetpassword);
authRoute.post("/logout", AuthController.logout);

module.exports = authRoute;
