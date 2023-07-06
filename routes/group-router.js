const express = require("express");
const router = express.Router();
const GroupModel = require("../model/group-model");
const UserModel = require("../model/user-model");

// Get all the groups in the collection.
router.get("/getallgroups", async (res) => {
  // the lean() function returns a raw json object from the DB, instead of a mongoose object.
  const all_groups = await GroupModel.find({}).lean();
  try {
    if (!all_groups) {
      res.status(404).json({ message: "No groups found." });
      return;
    }
    res.json(all_groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new group
router.post("/creategroup", async (req, res) => {
  var currTimeInUtc = Date.now();

  var new_group = new GroupModel({
    admin_user_name: req.body.user_name,
    admin_email: req.body.admin_email,
    members: [{ user_name: req.body.user_id, points: 0 }],
    fixtures_ids: [],
    created: currTimeInUtc,
  });

  try {
    new_group = await new_group.save();
    res.status(201).json({ new_group: new_group });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
