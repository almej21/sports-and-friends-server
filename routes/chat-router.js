const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const auth = require("../middleware/authUser");

const router = express.Router();

router.route("/").post(auth.authUser, accessChat);
router.route("/").get(auth.authUser, fetchChats);
router.route("/group").post(auth.authUser, createGroupChat);
router.route("/rename").put(auth.authUser, renameGroup);
router.route("/groupadd").put(auth.authUser, addToGroup);
router.route("/groupremove").put(auth.authUser, removeFromGroup);

module.exports = router;
