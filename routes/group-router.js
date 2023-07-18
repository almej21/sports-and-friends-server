const express = require("express");
const router = express.Router();
const GroupModel = require("../model/group-model");
const UserModel = require("../model/user-model");
const FuncService = require("../utils/function-service");

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

// Remove user from group.
router.patch("/removeuserfromgroup", async (req, res) => {
  const group_name = req.body.group_name;
  const group_pass = req.body.group_pass;
  const requesting_user = req.body.user_name;

  try {
    var group = await GroupModel.findOne({
      group_name: group_name,
      group_password: group_pass,
    }).lean();

    var user = await UserModel.findOne({
      user_name: requesting_user,
    }).lean();

    if (!group || !user) {
      res.status(404).json({ message: "Group name or password is incorrect" });
    } else {
      var updatedGroupMembers = group.members.filter(
        (member) => member.user_name != requesting_user
      );

      var newGroupDoc = new GroupModel({
        _id: group._id,
        group_name: group.group_name,
        group_password: group.group_password,
        admin_user_name: group.admin_user_name,
        admin_email: group.admin_email,
        members: updatedGroupMembers,
        fixtures_ids: group.fixtures_ids,
        created: group.created,
      });

      await GroupModel.deleteOne({ _id: group._id });
      newGroupDoc.save();

      var updatedGroups = user.groups_ids.filter(
        (groupId) => groupId != newGroupDoc._id
      );

      var newUserDoc = new UserModel({
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        password: user.password,
        member_since: user.member_since,
        credit: user.credit,
        points: user.points,
        groups_ids: updatedGroups,
      });

      await UserModel.deleteOne({ _id: user._id });
      newUserDoc.save();

      res.status(202).json({
        message: `${requesting_user} was removed from group: ${group_name}`,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add fixture to group.
router.patch("/addfixturetogroup", async (req, res) => {
  const group_name = req.body.group_name;
  const group_pass = req.body.group_pass;
  const fixtures_ids_to_add = req.body.fixtures_ids;
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
    } else if (user.user_name !== group.admin_user_name) {
      res.status(401).json({
        message: "You are not allowed to add fixtures to this group.",
      });
    } else {
      var group_obj = group.toObject();
      var already_exist = FuncService.haveCommonElement(
        group_obj.fixtures_ids,
        fixtures_ids_to_add
      );
      if (already_exist) {
        res.status(400).json({ message: "Fixture already exist in the group" });
      }
    }

    group.fixtures_ids = group.fixtures_ids.concat(fixtures_ids_to_add);
    group.save();
    res.status(202).json({
      message: `${fixtures_ids_to_add.length} fixtures added to group: ${group_name}`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
