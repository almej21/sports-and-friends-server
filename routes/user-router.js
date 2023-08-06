const express = require("express");
const router = express.Router();
const UserModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const tokens = require("../utils/tokens");
var auth = require("../middleware/authUser");

// Log in / verify email and password
router.post("/login", async (req, res) => {
  // the lean() function returns a raw json object from the DB, instead of a mongoose object.
  const user = await UserModel.findOne({ email: req.body.email }).lean();
  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    bcrypt.compare(req.body.password, user.password, (err, valid) => {
      if (!valid || err) {
        return res.status(401).json({
          error: true,
          message: "Username or password is wrong",
        });
      }
      //from here we've verified the user's email and password
      var refreshToken = tokens.generateRefreshToken(user);
      var accessToken = tokens.generateAccessToken(refreshToken);
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.json(user);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Log out / delete cookies
router.get("/logout", auth.authUser, (req, res) => {
  console.log("request to /user/logout");
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.json({ message: "User logged out" });
});

// Sign up / add new user / register user
router.post("/signup", async (req, res) => {
  var currTimeInUnix = new Date().getTime();

  // create a hashed string for the given password to store in the DB.
  var hashedPass = bcrypt.hashSync(req.body.password.trim(), 10);

  const user = new UserModel({
    user_name: req.body.user_name,
    email: req.body.email,
    password: hashedPass,
    member_since: currTimeInUnix,
    credit: 0,
    points: 0,
  });

  try {
    const existingUser = await UserModel.find({ email: req.body.email });
    if (existingUser.length > 0) {
      res.status(401).send("email already exists");
      return;
    } else {
      const newUser = await user.save();
      res.status(201).json({ new_user: newUser });
      return;
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get user's info by access token in the user's cookies
router.get("/userinfo", auth.authUser, async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: res.locals.user.email,
    }).lean();
    if (!user) {
      res.status(404).json({ message: "please login" });
      return;
    }

    var member_since_date = new Date(parseInt(user.member_since));
    user.member_since = member_since_date;

    res.status(200).json(user);
    return;
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
});

module.exports = router;
