const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: res.statusCode || 500,
    msg: err.message || "Something went wrong",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors).map((item) => item.message);
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  res.status(customError.statusCode).json({
    message: customError.msg,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

const notFound =
  ("/",
  (req, res) =>
    res.status(404).send("Page you were looking for was not found :("));

module.exports = { errorHandler, notFound };
