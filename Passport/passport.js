const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt"),
  ExtractJWT = passportJWT.ExtractJwt,
  JWTStrategy = passportJWT.Strategy;

const prisma = new PrismaClient();

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      try {
        console.log("user : ", email, password);
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (user) {
          await bcrypt.compare(password, user.password).then((result) => {
            if (result) {
              console.log("login successful");
              return cb(null, user, { message: "Logged In Successful" });
            } else {
              return cb(null, false, {
                message: "Incorrect user or password.",
              });
            }
          });
        } else {
          return cb(null, false, { message: "user not found" });
        }
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "mysecret",
    },
    async (jwtPayload, cb) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: jwtPayload.email,
          },
        });
        if (user) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);
