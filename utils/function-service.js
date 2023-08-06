const axios = require("axios");
const FixtureModel = require("../model/fixture-model");
const { saveFixture } = require("./db-service");
const chalk = require("chalk");

exports.haveCommonElement = (arr1, arr2) => {
  // Check if any element in arr1 exists in arr2
  return arr1.some((item) => arr2.includes(item));
};

function getNextSevenDays() {
  const numberOfDays = 11;
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Get the current date
  const currentDate = new Date();

  // Create an array to store the dates
  const datesArray = [];

  // Loop through the next 7 days and add them to the array
  for (let i = 0; i < numberOfDays; i++) {
    const nextDate = new Date(currentDate.getTime() + i * millisecondsPerDay);
    const formattedDate = nextDate.toISOString().slice(0, 10); // Convert date to "YYYY-MM-DD" format
    datesArray.push(formattedDate);
  }

  return datesArray;
}

//TODO:!!!
// replace the date array in line 35 to use the getNextSevenDays() func.
exports.fetchFixtures = () => {
  const leagues = { "Premier League": "PL", "La Liga": "PD" };
  // Call the function and get the array of next 7 days' dates
  const dates = ["2023-08-12", "2023-08-14"];
  // const nextSevenDaysDates = getNextSevenDays();
  var iteration = 0;

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
                    `New fixture was added: [${fixture.homeTeam.shortName} - ${fixture.awayTeam.shortName}]`
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
                `Fixture: [${fixture.homeTeam.shortName} - ${fixture.awayTeam.shortName}] already exist!`
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
