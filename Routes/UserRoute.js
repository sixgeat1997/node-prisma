const express = require("express");

const userRoute = express.Router();

const UserController = require("../Controllers/UserController");
const isAuth = require("../Middleware/is-Auth");

userRoute.get("/getuser", isAuth, UserController.getUser);
userRoute.put("/putuser/:id", UserController.updateUser);
userRoute.delete("/deleteuser/:id", UserController.destroyUser);
userRoute.get("/finduser/:id", UserController.finduser);

module.exports = userRoute;
