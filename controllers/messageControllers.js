const MessageModel = require("../models/message-model");
const UserModel = require("../models/user-model");
const ChatModel = require("../models/chat-model");

//@description     Get all Messages
//@route           GET /api/MessageModel/:chatId
//@access          Protected
const allMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//@description     Create New MessageModel
//@route           POST /MessageModel/
//@access          Protected
const sendMessage = async (req, res) => {
  const { content, chat } = req.body;

  if (!content || !chat) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.requestingUser._id,
    content: content,
    chat: chat,
  };

  try {
    var message = await MessageModel.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "user_name pic email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chat, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { allMessages, sendMessage };
