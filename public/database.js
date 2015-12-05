document.addEventListener('DOMContentLoaded', bindButton);
document.addEventListener('DOMContentLoaded', firstTable);

function bindButton() {
  document.getElementById('newWorkout').addEventListener('click', function(event){
    var request = new XMLHttpRequest();
    var name = document.getElementById('name').value;
    var reps = document.getElementById('reps').value;
    var weight = document.getElementById('weight').value;
    var date = document.getElementById('date').value;
    var lbs = document.getElementById('lbs').value;
    if (name == "") {
      console.log("error"); 
      return;
    }
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var response = JSON.parse(request.responseText);
        console.log(response);
        for (var i = 0; i < response.length; i++) {
          var id = response[i].id;
          var ids = document.getElementsByClassName("id");
          var found = false;
          for (var j = 0; !found && j < ids.length; j++) {
            console.log(id, ids[j].value);
            if (id == ids[j].value) {
              found = true;
            }
          }
          if (!found) {
            var name = response[i].name;
            var date = response[i].date;
            var lbs = response[i].lbs;
            var reps = response[i].reps;
            var weight = response[i].weight;
            var row = document.createElement("tr");
            var idCell = document.createElement("td");
            var nameCell = document.createElement("td");
            var repsCell = document.createElement("td");
            var weightCell = document.createElement("td");
            var dateCell = document.createElement("td");
            var lbsCell = document.createElement("td");
            idCell.appendChild(document.createTextNode(id));
            idCell.className = "id";
            nameCell.appendChild(document.createTextNode(name));
            repsCell.appendChild(document.createTextNode(reps));
            weightCell.appendChild(document.createTextNode(weight));
            dateCell.appendChild(document.createTextNode(date));
            lbsCell.appendChild(document.createTextNode(lbs));
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(repsCell);
            row.appendChild(weightCell);
            row.appendChild(dateCell);
            row.appendChild(lbsCell);
            var table = document.getElementById('workouts');
            table.appendChild(row);
          }
        }
      }
    }

    request.open('GET', 'http://52.88.123.171:5000/newWorkout?name=' + name + '&reps=' + reps + '&weight=' + weight + '&date=' + date + '&lbs=' + lbs, true);
    request.send(null);
    document.getElementById('name').value = "";
    document.getElementById('reps').value = "";
    document.getElementById('weight').value = "";
    document.getElementById('date').value = "";
    document.getElementById('lbs').value = "";
    event.preventDefault();
  });
}

function firstTable() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var response = JSON.parse(request.responseText);
      for (var i = 0; i < response.length; i++) {
        var id = response[i].id;
        var name = response[i].name;
        var date = response[i].date;
        var lbs = response[i].lbs;
        var reps = response[i].reps;
        var weight = response[i].weight;
        var row = document.createElement("tr");
        var idCell = document.createElement("td");
        var nameCell = document.createElement("td");
        var repsCell = document.createElement("td");
        var weightCell = document.createElement("td");
        var dateCell = document.createElement("td");
        var lbsCell = document.createElement("td");
        idCell.appendChild(document.createTextNode(id));
        idCell.className = "id";
        nameCell.appendChild(document.createTextNode(name));
        repsCell.appendChild(document.createTextNode(reps));
        weightCell.appendChild(document.createTextNode(weight));
        dateCell.appendChild(document.createTextNode(date));
        lbsCell.appendChild(document.createTextNode(lbs));
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(repsCell);
        row.appendChild(weightCell);
        row.appendChild(dateCell);
        row.appendChild(lbsCell);
        var table = document.getElementById('workouts');
        table.appendChild(row);
      }
    }
  }

  request.open('GET', 'http://52.88.123.171:5000/newWorkout', true);
  request.send(null);
}

