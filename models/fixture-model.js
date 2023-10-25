const mongoose = require("mongoose");

const fixtureSchema = new mongoose.Schema({
  api_fixture_id: Number,
  date: String,
  timestamp: Number,
  league: {
    name: String,
    country: String,
    logo: String,
    flag: String,
  },
  clubs: {
    home: {
      club_id: Number,
      name: String,
      logo: String,
    },
    away: {
      club_id: Number,
      name: String,
      logo: String,
    },
  },
  score: {
    winner: String,
    home: Number,
    away: Number,
  },
});

module.exports = mongoose.model("fixture", fixtureSchema);
