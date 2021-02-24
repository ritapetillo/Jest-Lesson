require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const express = require("express");
const server = new express();

const userRouter = require("./services/users");

server.use(express.json());

server.get("/test", (req, res) => {
  res.status(200).send({ message: "Test success" });
});

server.get("/cats", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) res.status(401);
    else {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if (!decoded) res.status(401)
      const catres = await axios.get("https://cataas.com/cat?json=true");
      const catData = catres.data;
      res.status(200).send(catData);
    }
  } catch (err) {
    res.status(401);
  }
});

server.use("/users", userRouter);

module.exports = server;
