// var jwt = require("jsonwebtoken");

// // set refreshToken cookie
// function setRefreshTokenCookie(req, res, next) {
//   // check if client sent cookie
//   var refreshToken = req.cookies.refreshToken;
//   if (refreshToken === undefined) {
//     // no: set a new cookie
//     var newRefreshToken = jwt.generateRefreshToken(req.body);
//     res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
//     console.log("cookie created successfully");
//   } else {
//     // yes, cookie was already present
//     console.log("cookie exists", refreshToken);
//   }
//   next(); // <-- important!
// }

// // set accessToken cookie
// function setAccessTokenCookie(req, res, next) {
//   // check if client sent cookie
//   var accessToken = req.cookies.accessToken;
//   if (accessToken === undefined) {
//     // no: set a new cookie
//     var newAccessToken = jwt.generateAccessToken(req.body);
//     res.cookie("accessToken", newAccessToken, { httpOnly: true });
//     console.log("cookie created successfully");
//   } else {
//     // yes, cookie was already present
//     console.log("cookie exists", accessToken);
//   }
//   next(); // <-- important!
// }
