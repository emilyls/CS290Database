var express = require('express');
var mysql = require('mysql');
var html = require('html');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
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
  if (Object.keys(req.query).length == 0) {
    pool.query('SELECT * FROM workouts', function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      res.send(JSON.stringify(rows));
    });
  }
  else {
    pool.query('INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)', [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
      if (err) {
        next(err);
        return;
      }
      pool.query('SELECT * FROM workouts', function(err, rows, fields) {
        if (err) {
          next(err);
          return;
        }
        res.send(JSON.stringify(rows));
      });
    });
  }
});

app.get('/updateWorkout', function(req,res,next) {
  console.log(req.body);
  // var data = {};
  // data.id = req.query.id;
  // data.name = req.query.name;
  // data.reps = req.query.reps;
  // data.weight = req.query.weight;
  // data.date = req.query.date;
  // data.lbs = req.query.lbs;
  res.render('update');
});

app.get('/deleteWorkout', function(req, res, next) {
  pool.query('DELETE FROM workouts WHERE id=(?)', [req.query.id], function(err, result) {
    if(err) {
      next(err);
      return;
    }
    res.send(JSON.stringify(result));
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
  res.sendFile(__dirname +'/public/Form.html');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
