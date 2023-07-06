const mongoose = require("mongoose");
const FixtureModel = require("../model/fixture-model");

exports.saveFixtures = async function (fixtures_arr_from_response) {
  var fixtures_arr_to_save = [];
  fixtures_arr_from_response.forEach((fixture) => {
    const fixture_doc = new FixtureModel({
      league: fixture.league,
      clubs: {
        home: {
          club_id: fixture.teams.home.id,
          name: fixture.teams.home.name,
          logo: fixture.teams.home.logo,
          winner: fixture.teams.home.winner,
        },
        away: {
          club_id: fixture.teams.away.id,
          name: fixture.teams.away.name,
          logo: fixture.teams.away.logo,
          winner: fixture.teams.away.winner,
        },
      },
      goals: {
        home: fixture.goals.home,
        away: fixture.goals.away,
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
