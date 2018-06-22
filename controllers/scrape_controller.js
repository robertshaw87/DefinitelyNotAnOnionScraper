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

// Require all models
const db = require("../models");


router.get("/", function (req, res) {
  db.Article.find({}, function (err, data) {
    if (err) {
      throw err;
    } else {
      res.render("index", {data: data});
    }
  })
});

router.get("/saved", function (req, res){
  db.Article.find({saved: true}, function (err, data) {
    if (err) {
      throw err;
    } else {
      res.render("index", {data: data});
    }
  })
})

router.get("/api/scrape", function (req, res) {
    request("https://old.reddit.com/r/nottheonion/", function(error, response, html) {

      var $ = cheerio.load(html);

      $(".thing").each(function(i, element) {

        var link = $(element).find("a.title").attr("href");
        var title = $(element).find("a.title").text();
        var img = $(element).find("a > img").attr("src")

        db.Article.create({
          title: title,
          link: link,
          img: img
        });
      });
      res.redirect("/");
    });
});

module.exports = router;