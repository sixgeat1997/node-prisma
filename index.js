const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const UserRoute = require("./Routes/UserRoute");
const AuthRoute = require("./Routes/AuthRoute");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/user", UserRoute);
app.use("/auth", AuthRoute);

app.use("*", (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3030, () => {
  console.log("app run port 3030");
});
