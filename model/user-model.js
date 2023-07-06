const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  member_since: String,
  credit: Number,
  points: Number,
  groups_ids: [String],
});

module.exports = mongoose.model("user", userSchema);
