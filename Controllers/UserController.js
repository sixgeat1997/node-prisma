const { PrismaClient } = require("@prisma/client");
const passport = require("passport");

const prisma = new PrismaClient();

exports.getUser = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (user) {
      const users = await prisma.user.findMany({
        include: {
          posts: true,
          Token: true,
        },
      });
      return res.json(users);
    } else {
      return res.send(info);
    }
  })(req, res, next);
};

exports.destroyUser = async (req, res) => {
  const { id } = req.params;
  await prisma.post.deleteMany({
    where: {
      authorId: Number(id),
    },
  });
  const post = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(post);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  console.log(name);
  try {
    const post = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email: email,
        name: name,
      },
    });

    res.json(post);
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` });
  }
};

exports.finduser = async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.send(user);
  } catch (err) {
    res.send(err);
  }
};
