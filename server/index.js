require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const app = express();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/", (req, res) => {
  res.status(200).send("bon");
});
//app.listen(8080);
module.exports = app;
