const express = require("express");
const router = express.Router();
const path = require("path");
const pool = require("../../db/db");

router.get("/", (req, res) => {
  res.send("home route");
});

router.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/notes.html"));
});

router.get("/notes/:id", async (req, res) => {
  res.send("single note route");
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/register.html"));
});

module.exports = router;
