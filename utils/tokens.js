var jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateRefreshToken = function (user) {
  //1. Do not use password and other sensitive fields
  //2. use fields that are useful in other parts of the
  //app/collections/models
  var user_payload = {
    user_name: user.user_name,
    email: user.email,
  };
  return (token = jwt.sign(user_payload, process.env.JWT_REFRESH, {
    // expiresIn: 60 * 60 * 24 * 7, // expires in 7 days
    expiresIn: 60 * 60 * 24, // this will be a numeric date value, to get the
    // expiration date in date-time format you must covert the numeric value to a date
    //(IN THE CLIENT SIDE)
  }));
};

exports.generateAccessToken = function (refreshToken) {
  //1. Do not use password and other sensitive fields
  //2. use fields that are useful in other parts of the
  //app/collections/models
  try {
    const verifiedToken = this.verifyRefToken(refreshToken);
    var user_payload = {
      user_name: verifiedToken.payload.user_name,
      email: verifiedToken.payload.email,
    };
    return (token = jwt.sign(user_payload, process.env.JWT_ACCESS, {
      // expiresIn: 60 * 60 * 24, // expires in 24 hours
      expiresIn: 60 * 60, //
    }));
  } catch (error) {
    return { error: error.message };
  }
};

exports.verifyRefToken = function (token) {
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_REFRESH);
    return {
      payload: decodedPayload,
      expired: false,
      info: "access token still valid",
    };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
    // throw new Error("refresh token invalid");
  }
};

exports.verifyAccToken = function (token) {
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_ACCESS);
    return {
      payload: decodedPayload,
      expired: false,
      info: "access token still valid",
    };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
};
