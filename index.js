const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2");
const { PrismaClient } = require("@prisma/client");

const UserRoute = require("./Routes/UserRoute");
const AuthRoute = require("./Routes/AuthRoute");
const configDatabase = require("./config/database");

const connect = async () => {
  const connectMySQL = await mysql.createConnection(configDatabase);
  return connectMySQL;
};

const app = express();
const sessionStroe = new MySQLStore(configDatabase, connect);
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: sessionStroe,
  })
);
app.use(cors());

app.use(async (req, res, next) => {
  console.log("-", req.session.user);
  if (!req.session.user) next();
  else {
    prisma.user
      .findUnique({
        where: {
          email: req.session.user.email,
        },
      })
      .then((data) => {
        req.user = data;
        next();
      })
      .catch((err) => console.log(err));
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use("/user", UserRoute);
app.use("/auth", AuthRoute);

app.use("*", (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3030, () => {
  console.log("app run port 3030");
});
