var express = require('express');
var mysql = require('mysql');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5000);

var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

app.get('/home', function(req, res, next) {
  var context = {};

  // Create Table
  var tableString = "CREATE TABLE workouts("+
  "id INT PRIMARY KEY AUTO_INCREMENT,"+
  "name VARCHAR(255) NOT NULL,"+
  "reps INT,"+
  "weight INT,"+
  "date DATE,"+
  "lbs BOOLEAN)";
  pool.query(tableString, function(err) {
    context.results = "Table created";
    res.render('Form', context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    });
  });
});