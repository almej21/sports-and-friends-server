const express = require("express");
const app = express();
const port = 3000;

// Define routes and middleware
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running! and listening at http://localhost:${port}`);
});
