const res = require("express/lib/response");

exports.handle404errors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "23503" || err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: err.details });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
