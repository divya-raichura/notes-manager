const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc    Register new user
// @route   POST /api/auth
// @access  Public
const register = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400);
    throw new Error("Please provide all fields: name, email and password");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password length must be more than 6 characters");
  }

  if (password.length > 50) {
    res.status(400);
    throw new Error("Password length must be less than 50 characters");
  }

  const emailAlreadyExists = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (emailAlreadyExists.rows.length > 0) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );

  if (user.rows.length > 0) {
    const tokenUser = createTokenUser(user.rows[0]);

    // response
    res.status(201).json({
      user: tokenUser,
      token: generateToken({ payload: tokenUser }),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Login user
// @route   POST /api/auth
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all fields: email and password");
  }

  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  if (
    user.rows.length > 0 &&
    (await bcrypt.compare(password, user.rows[0].password))
  ) {
    const tokenUser = createTokenUser(user.rows[0]);
    res.json({ user: tokenUser, token: generateToken({ payload: tokenUser }) });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
};

const generateToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const createTokenUser = (user) => {
  return { userId: user.id, name: user.name, email: user.email };
};

module.exports = { register, login };
