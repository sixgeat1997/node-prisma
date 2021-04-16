const express = require("express");

const userRoute = express.Router();

const UserController = require("../Controllers/UserController");

userRoute.get("/getuser", UserController.getUser);
userRoute.put("/putuser/:id", UserController.updateUser);
userRoute.delete("/deleteuser/:id", UserController.destroyUser);
userRoute.get("/finduser/:id", UserController.finduser);

module.exports = userRoute;
