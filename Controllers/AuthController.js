const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const prisma = new PrismaClient();
const passport = require("passport");

exports.login = async (req, res, next) => {
  try {
    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        console.log(user);

        if (err) return next(err);
        if (user) {
          const token = jwt.sign(user, "mysecret", {
            expiresIn: "1d",
          });
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
              httpOnly: true,
              maxAge: 60 * 60,
              sameSite: "strict",
              path: "/",
            })
          );
          await prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              Token: {
                create: {
                  token: token,
                },
              },
            },
          });
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save();
          res.statusCode = 200;
          return res.json({ user, token });
        } else {
          return res.send(info);
        }
      }
    )(req, res, next);
  } catch (error) {
    console.log(error);
  }
};
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });
//     if (!user) {
//       res.json({
//         message: "Authentication failed. User not found.",
//       });
//     } else if (user) {
//       const statuslogin = await bcrypt.compare(password, user.password);
//       if (statuslogin) {
//         req.session.isLoggedIn = true;
//         req.session.user = user;
//         return req.session.save((err) => {
//           console.log(err);
//           res.send(user);
//         });
//       } else {
//         res.json({ message: "Authentication failed. Wrong password." });
//       }
//     }
//   } catch (error) {
//     res.send(error);
//   }
// };

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      console.log(err);
      res.send("ok");
    });
  } catch (error) {
    console.log(error);
  }
};

exports.signup = async (req, res) => {
  const { name, email, posts, password, confrimpassword } = req.body;
  try {
    if (password != confrimpassword) {
      return res.json({ message: "Passwords do not match" });
    } else {
      const passwordhash = await bcrypt.hash(password, 12);
      const postData = posts
        ? posts.map((post) => {
            return { title: post.title, content: post.content || undefined };
          })
        : [];
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (user) {
        return res.json({
          message: "Authentication failed. email is already.",
        });
      } else {
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            posts: {
              create: postData,
            },
            password: passwordhash,
          },
        });
        return res.send(newUser);
      }
    }
  } catch (error) {
    return res.send(error);
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const { email, password, confrimpassword } = req.body;
    const user = await prisma.user
      .findUnique({
        where: {
          email: email,
        },
      })
      .catch((err) => {
        return res.send(err);
      });
    if (!user) {
      return res.json({
        message: "User not found.",
      });
    } else {
      if (password != confrimpassword) {
        return res.json({ message: "Passwords do not match" });
      } else {
        await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            password: await bcrypt.hash(password, 12),
          },
        });
        return res.json({
          message: "Change password success",
        });
      }
    }
  } catch (err) {
    return res.send(err);
  }
};
