// server
const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
require("express-async-errors");

// express app
const app = express();

// handlers import
const { notFound, errorHandler } = require("./middlewares/errorHandlers");

// routes import
const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
// app.use("/api/user/", protect, userRoutes);

// handlers
app.use(notFound);
app.use(errorHandler);

// server
app.listen(port, () => console.log(`Server running on port ${port}`));
