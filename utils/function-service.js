const axios = require("axios");
const FixtureModel = require("../model/fixture-model");
const { saveFixture } = require("./db-service");
const chalk = require("chalk");

exports.haveCommonElement = (arr1, arr2) => {
  // Check if any element in arr1 exists in arr2
  return arr1.some((item) => arr2.includes(item));
};

function getTodayAndTenthDay() {
  const today = new Date();
  const seventhDay = new Date();
  seventhDay.setDate(today.getDate() + 10);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayFormatted = formatDate(today);
  const seventhDayFormatted = formatDate(seventhDay);

  return [todayFormatted, seventhDayFormatted];
}

const leagues = {
  premier_league: "PL",
  la_liga: "PD",
  serie_a: "SA",
  bundesliga: "BL1",
  ligue1: "FL1",
};

exports.fetchFixtures = () => {
  // Call the function and get the array of dates.
  const dates = getTodayAndTenthDay();

  for (let league in leagues) {
    axios
      .get("https://api.football-data.org/v4/matches", {
        headers: { "X-Auth-Token": process.env.API_KEY },
        params: {
          competitions: leagues[league],
          dateFrom: dates[0],
          dateTo: dates[1],
        },
      })
      .then(async (response) => {
        var fixtures_arr = [...response.data.matches];
        fixtures_arr.forEach(async (fixture) => {
          const existingFixture = await FixtureModel.findOne({
            api_fixture_id: fixture.id,
          });
          if (!existingFixture) {
            saveFixture(fixture)
              .then(() => {
                console.log(
                  "Server log:",
                  chalk.green(
                    `New fixture was added: [${fixture.area.name}: ${fixture.homeTeam.shortName} - ${fixture.awayTeam.shortName}]`
                  )
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log(
              "Server log:",
              chalk.red(
                `Fixture: [${fixture.area.name}: ${fixture.homeTeam.shortName} - ${fixture.awayTeam.shortName}] already exists in the DB!`
              )
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.dateToUnixTimestamp = (dateString) => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
};
