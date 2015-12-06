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
  pool.query('INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)', 
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
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
});

app.get('/createTable', function(req, res, next) {
  pool.query('SELECT * FROM workouts', function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

app.post('/', function(req,res,next) {
  console.log(req.body);
  if (req.body['Edit']) {
    pool.query('SELECT * FROM workouts WHERE id=(?)', [req.body.id], function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      var data = rows[0];
      if(data.date != "0000-00-00") {
        var date = new Date(rows[0].date);
      	date = date.toJSON();
        data.date = date.substring(0,10);
      }
      if(data.lbs == 0){
        data.kilo = 1;
      }
      else {
        data.kilo = 0;
      }
      res.render('updateWorkout', data);
    });
  }
  else {
    consol.log(req.body);
    pool.query('SELECT * FROM workouts WHERE id=(?)', [req.body.id], function(err, row) {
      if (err) {
        next(err);
        return;
      }
      if (row.length == 1) {
        var currRow = row[0];
        pool.query('UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', 
          [req.body.name || currRow.name, req.body.reps || currRow.reps, req.body.weight || currRow.weight, req.body.date || currRow.date, req.body.lbs || currRow.lbs, req.body.id], 
          function(err, rows, results) {
          var data = {}
          if (err) {
            next(err);
            return;
          }
          res.sendFile(__dirname + '/public/Form.html');
        });
      }
    });
  }
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
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      if (err) {
        next(err);
        return
      }
    });
    res.sendFile(__dirname +'/public/Form.html');
  });
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
