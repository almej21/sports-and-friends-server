const chalk = require("chalk");
const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const DbService = require("./utils/db-service");
const userRouter = require("./routes/user-router.js");
const groupRouter = require("./routes/group-router.js");
const fixtureRouter = require("./routes/fixture-router.js");
const FixtureModel = require("./model/fixture-model");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Server log: Connected to Database");
  })
  .catch(() => {
    console.log("error with connecting to DB");
  });
const db = mongoose.connection;
// db.on("error", (err) => console.error(err));
// db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use("/user", userRouter);
app.use("/groups", groupRouter);
app.use("/fixtures", fixtureRouter);

app.get("/", (req, res) => {
  res.send("sports and friends api");
});

// Start the server
app.listen(port, () => {
  console.log(
    chalk.bgGreen(`Server running! and listening at http://localhost:${port}`)
  );
});

var date = "2023-08-12";
var league = "39";

setInterval(function () {
  axios
    .get("https://v3.football.api-sports.io/fixtures", {
      headers: { "x-apisports-key": process.env.API_KEY },
      params: { date: date, league: league, season: "2023" },
    })
    .then(async (response) => {
      var response_fixtures_arr = [...response.data.response];
      var fixtures_date = response.data.parameters.date;

      var existing_docs = FixtureModel.findOne({
        date: date,
        "league.name": league,
      });
      if (existing_docs) return;
      if (DbService.saveFixtures(response_fixtures_arr, fixtures_date)) {
        console.log(
          `Server log: ${response_fixtures_arr.length} ${response_fixtures_arr[0].league.name} fixtures saved successfully.`
        );
      } else {
        console.error("Server log: Error with saving documents");
      }
    });
}, 1000 * 4); // every 4 seconds.
// }, 1000 * 60 * 60); //every 1 hour.
