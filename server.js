require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const DbService = require("./utils/db-service");
const userRouter = require("./routes/user-router.js");
const groupRouter = require("./routes/group-router.js");
const fixtureRouter = require("./routes/fixture-router.js");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use("/user", userRouter);
app.use("/groups", groupRouter);
app.use("/fixtures", fixtureRouter);

app.get("/", (req, res) => {
  res.send("hell World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running! and listening at http://localhost:${port}`);
});

var response_arr = [];

setInterval(function () {
  axios
    .get("https://v3.football.api-sports.io/fixtures", {
      headers: { "x-apisports-key": process.env.API_KEY },
      params: { date: "2023-08-13", league: "140", season: "2023" },
    })
    .then(async (response) => {
      console.log(response.data.response);
      var response_fixtures_arr = [...response.data.response];
      var fixtures_date = response.data.parameters.date;

      if (DbService.saveFixtures(response_fixtures_arr, fixtures_date)) {
        console.log("Records saved successfully");
      } else {
        console.error("Error with saving documents");
      }
    });
  // }, 1000 * 4); // every 4 seconds.
}, 1000 * 60 * 60); //every 1 hour.
