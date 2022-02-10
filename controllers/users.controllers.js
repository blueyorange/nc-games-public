const { selectUsers, selectUserByUsername } = require("../models/users.models");

exports.getUsers = async (req, res, next) => {
  const users = await selectUsers();
  res.status(200).send(users);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      if (user === undefined) {
        return Promise.reject({ status: 404, msg: "user not found" });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => next(err));
};
