const axios = require("axios");

exports.haveCommonElement = (arr1, arr2) => {
  // Check if any element in arr1 exists in arr2
  return arr1.some((item) => arr2.includes(item));
};

exports.fetchFixtures = () => {
  const leagues = { "Premier League": 39, "La Liga": 140 };
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
};
