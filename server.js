const express = require("express");
const bodyParser = require("body-parser");

const exphbs = require("express-handlebars");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 8080;

const app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/scrape_controller")
app.use(routes);


app.listen(PORT, function() {
  console.log("App listening on port " + PORT);
});
