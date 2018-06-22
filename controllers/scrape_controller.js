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
  console.log("banana")
  db.Article.find({saved: true}).populate("note").then(function (data) {
    console.log(data)
    res.render("index", {data: data});
  }).catch(function(err) {
    res.json(err)
  })
});

router.get("/api/scrape", function (req, res) {
    request("https://old.reddit.com/r/nottheonion/", function(error, response, html) {
      var $ = cheerio.load(html);
      var results = [];
      $(".thing").each(function(i, element) {
        var link = $(element).find("a.title").attr("href");
        var title = $(element).find("a.title").text();
        var img = $(element).find("a > img").attr("src") || "/assets/images/placeholder.jpg";
        results.push({
          title: title,
          link: link,
          img: img
        });
      });
      db.Article.insertMany(results).then(function (data) {
        res.redirect("/");
      }).catch(function (err) {
        res.redirect("/");
      })
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
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;