const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.json({
        message: "Authentication failed. User not found.",
      });
    } else if (user) {
      const statuslogin = await bcrypt.compare(password, user.password);
      if (statuslogin) {
        res.send(user);
      } else {
        res.json({ message: "Authentication failed. Wrong password." });
      }
    }
  } catch (error) {
    res.send(error);
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

exports.resetpassword = async (req, res) => {};
