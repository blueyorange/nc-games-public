usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  updateUser,
} = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);
usersRouter.route("/:username").get(getUserByUsername).patch(updateUser);

module.exports = usersRouter;
