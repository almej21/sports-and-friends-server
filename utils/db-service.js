const mongoose = require("mongoose");
const FixtureModel = require("../models/fixture-model");
const FunService = require("./function-service");

const leagues = {
  "Primera Division": "La Liga",
};

const saveFixtures = async function (fixtures_arr_from_response) {
  var fixtures_arr_to_save = [];

  fixtures_arr_from_response.forEach((fixture) => {
    const timestamp = FunService.dateToUnixTimestamp(fixture.utcDate);

    const fixture_doc = new FixtureModel({
      api_fixture_id: fixture.id,
      date: fixture.utcDate.substring(0, 10),
      fixture_id: fixture.id,
      timestamp: timestamp,
      league: {
        name: leagues[fixture.competition.name],
        country: fixture.area.name,
        logo: fixture.competition.emblem,
        flag: fixture.area.flag,
      },
      clubs: {
        home: {
          club_id: fixture.homeTeam.id,
          name: fixture.homeTeam.shortName,
          logo: fixture.homeTeam.crest,
        },
        away: {
          club_id: fixture.awayTeam.id,
          name: fixture.awayTeam.shortName,
          logo: fixture.awayTeam.crest,
        },
      },
      goals: {
        home: fixture.score.home,
        away: fixture.score.away,
      },
    });

    fixtures_arr_to_save.push(fixture_doc);
  });

  try {
    await FixtureModel.create(fixtures_arr_to_save);
    return true;
  } catch (error) {
    return false;
  }
};

function formatDateString(inputDate) {
  const [year, month, day] = inputDate.split("-");
  return `${day}.${month}.${year}`;
}

const saveFixture = async function (fixture) {
  const timestamp = FunService.dateToUnixTimestamp(fixture.utcDate);

  const fixture_doc = new FixtureModel({
    api_fixture_id: fixture.id,
    date: formatDateString(fixture.utcDate.substring(0, 10)),
    fixture_id: fixture.id,
    timestamp: timestamp,
    league: {
      name: fixture.competition.name,
      country: fixture.area.name,
      logo: fixture.competition.emblem,
      flag: fixture.area.flag,
    },
    clubs: {
      home: {
        club_id: fixture.homeTeam.id,
        name: fixture.homeTeam.shortName,
        logo: fixture.homeTeam.crest,
      },
      away: {
        club_id: fixture.awayTeam.id,
        name: fixture.awayTeam.shortName,
        logo: fixture.awayTeam.crest,
      },
    },
    score: {
      winner: fixture.score.winner,
      home: fixture.score.fullTime.home,
      away: fixture.score.fullTime.away,
    },
  });
  try {
    await fixture_doc.save();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  saveFixtures: saveFixtures,
  saveFixture: saveFixture,
};
