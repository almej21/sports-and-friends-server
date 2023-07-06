const mongoose = require("mongoose");

const fixtureSchema = new mongoose.Schema({
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
      winner: String,
    },
    away: {
      club_id: Number,
      name: String,
      logo: String,
      winner: String,
    },
  },
  goals: {
    home: Number,
    away: Number,
  },
});

module.exports = mongoose.model("fixture", fixtureSchema);
