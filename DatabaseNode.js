var express = require('express');
var mysql = require('mysql');
var html = require('html');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', 5000);

var pool = mysql.createPool({
  connectionLimit: 10,
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

app.use(express.static(__dirname + '/public'));

app.get('/newWorkout', function(req, res, next) {
  pool.query('INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)', [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if (err) {
      next(err);
      return;
    }
  });
  rens.render(getData)
});

app.get('/getData', function(req, res, next) {
  pool.query('SELECT * FROM workouts', function(err, rows, fields) {
    var context = {};
    if (err) {
      next(err);
      return;
    }
    console.log(JSON.stringify(rows));
  });
  
});

app.get('/reset-table',function(req,res,next){
  context = {}
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      console.log(context.results);
    });
  });
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
