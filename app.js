const express = require("express");

// const hostname = "localhost";
// const port = 3000;
const postgres = require("@vercel/postgres");
const app = express();

app.get("/", (request, response) => {
  return response.json({ message: "Welcome to our note taking app" });
});

// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

app.get("*", async (request, response) => {
  createNotes();
  // table was created => load data
  // wir bekommen hier ein Objekt mit rows zurück
  const { rows } = await postgres.sql`SELECT * FROM notes`;
  response.status(404).json(rows);
  // .json({ success: false, message: "route not defined" });
});

module.exports = app;

/**
 * - we want to create a new table
 */
async function createNotes() {
  await postgres.sql`(CREATE TABLE IF NOT EXITS notes (
        id SERIAL PRIMARY KEY,
        content VARCHAR(255)
    ))`;
}
