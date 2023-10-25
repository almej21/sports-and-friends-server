const chalk = require("chalk");
const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const userRouter = require("./routes/user-router.js");
const groupRouter = require("./routes/group-router.js");
const fixtureRouter = require("./routes/fixture-router.js");
const chatRouter = require("./routes/chat-router.js");
const messageRouter = require("./routes/message-router.js");
const FunctionsService = require("./utils/function-service");
const cors = require("cors");
const { Server } = require("socket.io");
var cookieParser = require("cookie-parser");
const http = require("http");

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    console.log("newMessageReceived.chat: ", newMessageReceived.chat);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log(chalk.bgGreen("Server log: Connected to Database"));
  })
  .catch((err) => {
    console.log(chalk.bgRed("error with connecting to DB"));
    console.log(err.response);
  });
const db = mongoose.connection;
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/groups", groupRouter);
app.use("/fixtures", fixtureRouter);
app.use("/chat", chatRouter);
app.use("/messages", messageRouter);

app.get("/", (req, res) => {
  res.send("sports and friends api");
});

// Start the server
server.listen(port, () => {
  console.log(
    chalk.bgGreen(`Server running! and listening at http://localhost:${port}`)
  );
});

setInterval(function () {
  FunctionsService.fetchFixtures();
  // }, 1000 * 31); // every 31 seconds. 10 calls/minute is allowed.
  // a request is being made for every league. 5 leagues = 5 requests.
}, 1000 * 60 * 30); //every 30 minuets.
// }, 1000 * 3); //every 30 minuets.

setInterval(function () {
  FunctionsService.deleteDocs();
}, 1000 * 60 * 60 * 1); //every 1h run deletion of prev fixtures.
