var tokens = require("../utils/tokens");
// const chalk = require("chalk");

//authenticate user middleware
exports.authUser = function (req, res, next) {
  var accessToken = req.cookies.accessToken || req.headers.accessToken;
  var refreshToken = req.cookies.refreshToken || req.headers.refreshToken;
  if (!accessToken) {
    return res.status(401).json({ message: "Must pass token" });
  }

  var user = tokens.verifyAccToken(accessToken);

  if (!user || user.expired) {
    user = tokens.verifyRefToken(refreshToken);
    if (!user || user.expired) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    accessToken = tokens.generateAccessToken(refreshToken);
  }
  res.locals.user = user.payload;
  res.cookie("accessToken", accessToken, { httpOnly: true });
  next();
};

// console.log(
//   chalk.bgRed(`res.status(401).json({ message: "Must pass token" })`)
// );

// console.log(
//   chalk.bgRed(`res.status(401).json({ message: "Invalid token" })`)
// );
