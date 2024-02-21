const express = require("express");

const hostname = "localhost";
const port = 3000;
const app = express();

app.get("/", (request, response) => {
  return response.json({ message: "Welcome to our note taking app" });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
