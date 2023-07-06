const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  admin_user_name: {
    type: String,
    required: true,
  },
  admin_email: {
    type: String,
    required: true,
  },
  members: [
    {
      user_name: String,
      points: Number,
      _id: false, // mongoose is adding the _id field automatically, so here I disable it.
    },
  ],
  fixtures_ids: [String],
  created: Number,
});

module.exports = mongoose.model("group", groupSchema);
