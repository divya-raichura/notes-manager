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
const authRoutes = require("./routes/api/authRoutes");
const userRoutes = require("./routes/api/userRoutes");
const notesRoutes = require("./routes/api/notesRoutes");
const clientRoutes = require("./routes/client/clientRoutes");

// security and middlewares
const cors = require("cors");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.DOMAIN, credentials: true }));
app.use(express.static("frontend"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user/", protect, userRoutes);
app.use("/api/notes", protect, notesRoutes);
app.use("/", clientRoutes); // client

// handlers
app.use(notFound);
app.use(errorHandler);

// server
app.listen(port, () => console.log(`Server running on port ${port}`));
