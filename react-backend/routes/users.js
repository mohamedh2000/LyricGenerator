var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());

/* GET users listing. */
app.get('/', function(req, res, next) {
  res.json([
    {id: 1, username: "somebody"},
    {id: 2, username: "somebody_else"}
  ])
});

module.exports = app;

