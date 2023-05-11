// server
const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
require("express-async-errors");

// express app
const app = express();

// handlers import
const { notFound, errorHandler } = require("./middlewares/errorHandlers");
const protect = require("./middlewares/authMiddleware");

// routes import
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user/", protect, userRoutes);
app.use("/api/notes", protect, notesRoutes);

// handlers
app.use(notFound);
app.use(errorHandler);

// server
app.listen(port, () => console.log(`Server running on port ${port}`));
