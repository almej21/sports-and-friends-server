const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
var auth = require("../middleware/authUser");

const router = express.Router();

router.route("/:chatId").get(auth.authUser, allMessages);
router.route("/").post(auth.authUser, sendMessage);

module.exports = router;
