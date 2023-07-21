const express = require("express");
const server = express();
server.use(express.json());
const userRouter = require("./users/user-router");
const tweetRouter = require("./tweets/tweet-router");
const authRouter = require("./auth/auth-router");

server.get("/", (req, res) => {
  res.send("<h1>appxx is working</h1>");
});

server.use("/api/users", userRouter);
server.use("/api/tweets", tweetRouter);
server.use("/api/auth", authRouter);

module.exports = server;
