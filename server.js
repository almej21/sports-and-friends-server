require("dotenv").config();
const axios = require("axios");

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const userRouter = require("./routes/user-router.js");

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("hell World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running! and listening at http://localhost:${port}`);
});

setInterval(function () {
  axios
    .get("https://v3.football.api-sports.io/fixtures", {
      headers: { "x-apisports-key": process.env.API_KEY },
      params: { date: "2023-06-19", league: "39" },
    })
    .then((response) => {
      console.log(response.data.response);
    })
    .catch((err) => console.error(err));
}, 1000 * 5);
// }, 1000 * 60 * 60);
