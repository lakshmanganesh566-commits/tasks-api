// ------------------------------------------------------------
// Simple Notes REST API (Node.js + Express)
// Storage: a local JSON file (notes.json) - no database needed
// ------------------------------------------------------------

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "notes.json");

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// ---------- Storage helpers ----------

// Load notes from the JSON file (returns [] if the file doesn't exist yet)
function loadNotes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Save the notes array back to the JSON file
function saveNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// Keep notes in memory, initialised from disk
let notes = loadNotes();

// Next id = highest existing id + 1
let nextId = notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;

// ---------- Routes ----------

// Health check / welcome route
app.get("/", (req, res) => {
  res.json({ message: "Notes API is running" });
});

// CREATE: add a new note
// POST /notes   body: { "title": "...", "content": "..." }
app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  // Basic validation
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }

  const note = {
    id: nextId++,
    title: title.trim(),
    content: content || "",
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  saveNotes(notes);
  res.status(201).json(note); // 201 = Created
});

// READ: get all notes
// GET /notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// READ: get a single note by id
// GET /notes/:id
app.get("/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(note);
});

// UPDATE: modify an existing note
// PUT /notes/:id   body: { "title": "...", "content": "..." }
app.put("/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  const { title, content } = req.body;

  // Only update fields that were actually sent
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title cannot be empty" });
    }
    note.title = title.trim();
  }
  if (content !== undefined) note.content = content;
  note.updatedAt = new Date().toISOString();

  saveNotes(notes);
  res.json(note);
});

// DELETE: remove a note
// DELETE /notes/:id
app.delete("/notes/:id", (req, res) => {
  const index = notes.findIndex((n) => n.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  const [deleted] = notes.splice(index, 1);
  saveNotes(notes);
  res.json({ message: "Note deleted", note: deleted });
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
