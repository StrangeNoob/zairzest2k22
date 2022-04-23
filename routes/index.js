const express = require("express");
const router = express.Router();

const auth = require("./auth");
const event = require("./events");

module.exports = {
  auth,
  event,
};
