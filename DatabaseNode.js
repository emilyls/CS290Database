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

// From assignment: allows access to MySQL database
var pool = mysql.createPool({
  connectionLimit: 10,
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

// Use static page for the main page
app.use(express.static(__dirname + '/public'));

app.get('/newWorkout', function(req, res, next) {
  // Insert new workout into the MySQL table
  pool.query('INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)', 
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if (err) {
      next(err);
      return;
    }
    // Get all rows from the table
    pool.query('SELECT * FROM workouts', function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      // Send all rows in table, following the insertion of a new workout
      res.send(JSON.stringify(rows));
    });
  });
});

app.get('/createTable', function(req, res, next) {
  // Get all rows from the table
  pool.query('SELECT * FROM workouts', function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    // Send all rows
    res.send(JSON.stringify(rows));
  });
});

app.post('/', function(req,res,next) {
  if (req.body['Edit']) {
    // If the edit button has been clicked, select the row to be edited
    pool.query('SELECT * FROM workouts WHERE id=(?)', [req.body.id], function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      // Format the date as a Date object in JSON format that has been parsed to format YYYY-MM-DD
      var data = rows[0];
      if(data.date != "0000-00-00") {
        var date = new Date(rows[0].date);
      	date = date.toJSON();
        data.date = date.substring(0,10);
      }
      // Add field to data to hold Kilos (for Handlebars template)
      if(data.lbs == 0){
        data.kilo = 1;
      }
      else {
        data.kilo = 0;
      }
      // Render the Handlebars template for updating the row, with the current values from the database
      res.render('updateWorkout', data);
    });
  }
  else {
    // Once the row has been updated, select the row by id
    pool.query('SELECT * FROM workouts WHERE id=(?)', [req.body.id], function(err, row) {
      if (err) {
        next(err);
        return;
      }
      if (row.length == 1) {
        var currRow = row[0];
        // Update the values if they are different from the current values
        // Always update LBS to the value in the request, because 1 || # always returns true and req.body.lbs || currRow.lbs will always set LBS to 1
        pool.query('UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', 
          [req.body.name || currRow.name, req.body.reps || currRow.reps, req.body.weight || currRow.weight, req.body.date || currRow.date, req.body.lbs, req.body.id], 
          function(err, rows, results) {
          var data = {}
          if (err) {
            next(err);
            return;
          }
          // Return to main page (static html)
          res.sendFile(__dirname + '/public/Form.html');
        });
      }
    });
  }
});

app.get('/deleteWorkout', function(req, res, next) {
  // Delete the row from MySQL that has the correct ID number
  pool.query('DELETE FROM workouts WHERE id=(?)', [req.query.id], function(err, result) {
    if(err) {
      next(err);
      return;
    }
    res.send(JSON.stringify(result));
  });
});

// RESET table copied from assignment
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
