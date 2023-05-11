const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // payload that we had signed jwt with
    const { userId, name, email } = decoded;

    // set user object on req so that we can identify and serve data based on who the user is
    req.user = { userId, name, email };

    next();
  } catch (error) {
    console.log(error);

    res.status(401);

    throw new Error("Not authorized");
  }
};

module.exports = protect;
