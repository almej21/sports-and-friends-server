const express = require("express");
const router = express.Router();
const UserModel = require("../model/user-model");
const FixtureModel = require("../model/fixture-model");
const FunService = require("../utils/function-service");

// Get all fixtures by date and league.
router.get("/getfixturesbydateandleague", async (req, res) => {
  const date = req.query.date;
  const league = req.query.league;

  try {
    const fixtures = await FixtureModel.find({
      date: date,
      "league.name": league,
    }).lean();

    if (fixtures.length > 0) {
      res.status(200).json(fixtures);
    } else {
      res.status(404).json({ message: "No fixtures found." });
    }
  } catch (err) {
    res.status(404).error(err);
  }
});

// Get all fixtures for the next 7 days.
router.get("/allfixtures", async (req, res) => {
  try {
    const fixtures = await FixtureModel.find({}).lean();

    // Get the current date
    const today = new Date();

    // Add 7 days to the current date
    var seventhDayFromToday = new Date(today);
    seventhDayFromToday.setDate(today.getDate() + 7);

    // Format the date as a string (optional)
    seventhDayFromToday = seventhDayFromToday.toISOString().slice(0, 10);

    const filteredFixtureArray = fixtures.filter((fixture) => {
      let fixture_date = new Date(fixture.date);

      return fixture_date <= seventhDayFromToday;
    });

    if (filteredFixtureArray.length > 0) {
      res.status(200).json(filteredArray);
    } else {
      res.status(404).json({ message: "No fixtures found." });
    }
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
