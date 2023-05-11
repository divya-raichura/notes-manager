const db = require("../db/db");

/**
 * @desc Get all tasks
 * @route GET /api/notes
 * @access Private
 */
const getNotes = async (req, res) => {
  const { rows } = await db.query("SELECT * FROM notes WHERE user_id = $1", [
    req.user.userId,
  ]);

  res.status(200).json({ notes: rows });
};

/**
 * @desc Set task
 * @route POST /api/notes
 * @access Private
 */
const postNotes = async (req, res) => {
  if (!req.body.title || !req.body.content) {
    res.status(400);
    throw new Error("Title and Content field are required");
  }

  req.body.user_id = req.user.userId;

  const { title, content, user_id } = req.body;

  const { rows } = await db.query(
    "SELECT * FROM notes WHERE title = $1 AND user_id = $2",
    [title, user_id]
  );

  if (rows.length > 0) {
    res.status(400);
    throw new Error("Note with this title already exists");
  }

  const newNote = await db.query(
    "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, user_id]
  );

  res.status(201).json({ newNote: newNote.rows[0] });
};

/**
 * TODO
 */

const deleteNotes = async (req, res) => {
  res.send("deleteNotes");
};

const putNotes = async (req, res) => {
  res.send("putNotes");
};

const getSingleNote = async (req, res) => {
  res.send("getSingleNote");
};

module.exports = {
  getNotes,
  deleteNotes,
  postNotes,
  putNotes,
  getSingleNote,
};
