const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    }
  } catch (error) {
    console.log(error);

    res.status(401);

    throw new Error("Not authorized");
  }
};

module.exports = protect;
