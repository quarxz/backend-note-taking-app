const express = require("express");
const postgres = require("@vercel/postgres");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (request, response) => {
  createNotes();
  // table was created => load data
  // wir bekommen hier ein Objekt mit rows zurück
  const { rows } = await postgres.sql`SELECT * FROM notes`;
  return response.json(rows);
  //   return response.json({ message: "Welcome to our note taking app" });
});

app.get("/:id", async (request, response) => {
  createNotes();
  const { id } = request.params;
  const { rows } =
    await postgres.sql`SELECT * FROM notes WHERE id = ${id}`;

  if (!rows.length) {
    return response.json({ error: "Note not found." });
  }

  return response.json(rows[0]);
});

app.post("/", async (request, response) => {
  createNotes();
  const { content } = request.body;
  if (content) {
    await postgres.sql`INSERT INTO notes (content) VALUES (${content})`;
    response.json({ message: "Successfully created note." });
  } else {
    response.json({ error: "Note NOT createt. Content is missing." });
  }
});

// app.put("/:id", (request, response) => {
//   createNotes();
//   const { id } = request.params;
//   const
// });

app.delete("/:id", async (request, response) => {
  createNotes();
  const { id } = request.params;
  const { rowCount } =
    await postgres.sql`DELETE FROM notes WHERE id = ${id}`;

  if (!rowCount) {
    return response.json({ error: "Note not found." });
  }
  response.json({ message: "Successfully delete note." });
});

app.get("*", (request, response) => {
  response.status(404).json({ message: "route not defined" });
});

module.exports = app;

/**
 * - we want to create a new table
 */
async function createNotes() {
  await postgres.sql`CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        content VARCHAR(255)
    )`;
}

// curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{"content":"Es geht der Bibabutzemann"}'

// curl -X DELETE http://localhost:3000/6 -H 'Content-Type: plain/text' -d '{"content":"My second note"}'
