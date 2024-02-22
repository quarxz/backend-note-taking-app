const express = require("express");
const postgres = require("@vercel/postgres");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (request, response) => {
  createTables();
  //table was created => load data
  // gives you an Object !
  const { rows } = await postgres.sql`SELECT * FROM notes`;
  return response.json(rows);
});

app.get("/:id", async (request, response) => {
  createTables();
  //table was created => load data
  const { id } = request.params;
  const { rows } =
    await postgres.sql`SELECT * FROM notes WHERE id = ${id}`;

  if (!rows.length) {
    return response.json({ error: "Note not found." });
  }

  return response.json(rows[0]);
});

app.post("/", async (request, response) => {
  createTables();
  const { content } = request.body;
  if (content) {
    await postgres.sql`INSERT INTO notes (content) VALUES (${content})`;
    response.json({ message: "Successfully created note." });
  } else {
    response.json({ error: "Note NOT created. Content is missing." });
  }
});

/* vegan delete route */
app.delete("/:tofu", async (request, response) => {
  createTables();
  /* const  tofu  = request.params.tofu; */
  const { tofu } = request.params;
  const { rowCount } =
    await postgres.sql`DELETE FROM notes WHERE id = ${tofu}`;

  if (!rowCount) {
    return response.json({ error: "Note not found." });
  }

  response.json({ message: "Successfully deleted note." });
});

app.put("/:id", async (req, res) => {
  createTables();
  // const id = req.params.id;
  const { id } = req.params;
  const { content } = req.body;

  const { rowCount } =
    await postgres.sql`UPDATE notes SET content = ${content} WHERE id=${id}`;

  if (!rowCount) {
    return res.json({ error: "note not found" });
  }

  return res.json("Successfully edited the note.");
});

// default catch-all handler
app.get("*", (request, response) => {
  response.status(404).json({ message: "route not defined" });
});

module.exports = app;

/*
 * - we want to create a new table called notes
 * - from within our code
 */
async function createTables() {
  await postgres.sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
  )`;
  await postgres.sql`CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      content VARCHAR(255),
      userid INT REFERENCES users (id)
  )`;
}

/**
 * (JOINS!)
 *
 * todo: multiple users with multiple notes
 * - create another table users
 * - users has to references the table notes
 *
 * user table:
 * - id
 * - name
 *
 * note table:
 * - id
 * - content
 * - userId
 *
 *
 *  exercise get one note from spezific user
 *
 * */
