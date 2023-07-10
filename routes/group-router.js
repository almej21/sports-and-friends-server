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

// Create new group.
router.post("/creategroup", async (req, res) => {
  var currTimeInUtc = Date.now();

  var new_group = new GroupModel({
    group_name: req.body.group_name,
    group_password: req.body.group_password,
    admin_user_name: req.body.user_name,
    admin_email: req.body.admin_email,
    members: [{ user_name: req.body.user_name, points: 0 }],
    fixtures_ids: [],
    created: currTimeInUtc,
  });

  try {
    var user = await UserModel.findOne({
      user_name: req.body.user_name,
    });
    if (!user) {
      res
        .status(400)
        .json({ message: `user: '${req.body.user_name}' not found.` });
    } else {
      new_group = await new_group.save();
    }
    res.status(201).json({ new_group: new_group });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add user to group.
router.patch("/addusertogroup", async (req, res) => {
  const group_name = req.body.group_name;
  const group_pass = req.body.group_pass;
  const requesting_user = req.body.user_name;

  try {
    var group = await GroupModel.findOne({
      group_name: group_name,
      group_password: group_pass,
    });

    var user = await UserModel.findOne({
      user_name: requesting_user,
    });

    if (!group || !user) {
      res.status(404).json({ message: "Group name or password is incorrect" });
    } else {
      var group_obj = group.toObject();
      for (member of group_obj.members) {
        if (member.user_name == requesting_user) {
          console.log(
            `can't add user to group, user: '${requesting_user}' is already in the group`
          );
          res.status(400).json({
            message: `user: '${requesting_user}' is already in the group`,
          });
          return;
        }
      }

      group.members.push({ user_name: requesting_user, points: 0 });
      group.save();
      user.groups_ids.push(group._id);
      user.save();
      res.status(202).json({
        message: `${requesting_user} was added to group: ${group_name}`,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;