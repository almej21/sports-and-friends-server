const chalk = require("chalk");
const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const userRouter = require("./routes/user-router.js");
const groupRouter = require("./routes/group-router.js");
const fixtureRouter = require("./routes/fixture-router.js");
const FunService = require("./utils/function-service");
const cors = require("cors");
var cookieParser = require("cookie-parser");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Server log: Connected to Database");
  })
  .catch((err) => {
    console.log("error with connecting to DB");
    console.log(err.response.data);
  });
const db = mongoose.connection;
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

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

setInterval(function () {
  FunService.fetchFixtures();
  // }, 1000 * 5); // every 5 seconds.
}, 1000 * 60 * 60 * 12); //every 12 hours.
