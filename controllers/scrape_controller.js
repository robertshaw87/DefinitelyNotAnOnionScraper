const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


router.get("/", function (req, res) { 
  res.render("index", {});
});

module.exports = router;