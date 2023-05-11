const express = require("express");
const router = express.Router();

const { me } = require("../controllers/userController");

/**
 * route: /api/user/me
 * methods: get
 */
router.get("/me", me);

module.exports = router;
