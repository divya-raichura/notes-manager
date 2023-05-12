const db = require("../db/db");

/**
 * @desc Get all notes
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
 * @desc Set note
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
 * @desc Update note
 * @route PUT /api/notes/:id
 * @access Private
 */
const putNotes = async (req, res) => {
  const { title, content } = req.body;
  const userID = req.user?.userId;

  const { rows } = await db.query(
    "UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
    [title, content, req.params.id, userID]
  );

  if (rows.length === 0) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.status(200).json({ updatedNote: rows[0] });
};

/**
 * @desc Get single note
 * @route GET /api/notes/:id
 * @access Private
 */
const getSingleNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;

  const { rows } = await db.query(
    "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
    [noteId, userId]
  );

  if (rows.length === 0) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.status(200).json({ note: rows[0] });
};

/**
 * @desc Delete note
 * @route DELETE /api/notes/:id
 * @access Private
 */
const deleteNotes = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;

  const { rows } = await db.query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
    [noteId, userId]
  );

  if (rows.length === 0) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.status(200).json({ deletedNote: rows[0] });
};

module.exports = {
  getNotes,
  deleteNotes,
  postNotes,
  putNotes,
  getSingleNote,
};
