const express = require("express");
const router = express.Router();
const {
  getNotes,
  deleteNotes,
  postNotes,
  putNotes,
  getSingleNote,
} = require("../controllers/notesController");

/**
 * route: /api/notes/
 * methods: get, post
 */
router.get("/", getNotes);
router.post("/", postNotes);

/**
 * route: /api/notes/:id
 * methods: get, put, delete
 */
router.get("/:id", getSingleNote);
router.put("/:id", putNotes);
router.delete("/:id", deleteNotes);

module.exports = router;
