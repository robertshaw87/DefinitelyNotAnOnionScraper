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
  db.Article.find({}).populate("note").then(function (data) {
    res.render("index", {data: data});
  }).catch(function(err) {
    res.json(err)
  })
});

router.get("/saved", function (req, res){
  db.Article.find({saved: true}).populate("note").then(function (data) {
    res.render("index", {data: data});
  }).catch(function(err) {
    res.json(err)
  })
});

router.get("/api/scrape", function (req, res) {
    request("https://old.reddit.com/r/nottheonion/", function(error, response, html) {
      var $ = cheerio.load(html);
      $(".thing").each(function(i, element) {
        var link = $(element).find("a.title").attr("href");
        var title = $(element).find("a.title").text();
        var img = $(element).find("a > img").attr("src") || "/assets/images/placeholder.jpg";
        db.Article.create({
          title: title,
          link: link,
          img: img
        });
      });
      res.redirect("/");
    });
});

router.post("/api/save/:id", function (req, res) {
  db.Article.findOneAndUpdate(
    {_id: req.params.id}, 
    {$set : {saved: req.body.saved}}, 
    function (err, data) {
      res.end();
    });
});

router.post("/api/note/:id", function (req, res) {
  var newNote = {
    title: req.body.title,
    body: req.body.body
  }
  db.Note.findOneAndUpdate(
    {_id: req.params.id},
    newNote
  ).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    res.json(err);
  })
});

module.exports = router;