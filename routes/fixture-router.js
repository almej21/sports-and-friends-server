const express = require("express");
const router = express.Router();
const UserModel = require("../model/user-model");
const FixtureModel = require("../model/fixture-model");
const FunService = require("../utils/function-service");

// Get all fixtures by date and league.
router.get("/getfixtures", async (req, res) => {
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

module.exports = router;
