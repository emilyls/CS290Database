document.addEventListener('DOMContentLoaded', bindButton);
document.addEventListener('DOMContentLoaded', firstTable);
//document.addEventListener('DOMContentLoaded', updateRow);

function bindButton() {
  document.getElementById('newWorkout').addEventListener('click', function(event) {
    var request = new XMLHttpRequest();
    var valid = true;
    var name = document.getElementById('name').value;
    var reps = document.getElementById('reps').value;
    var weight = document.getElementById('weight').value;
    var date = document.getElementById('date').value;
    var lbs = document.getElementById('lbs').value;
    if (name == "") {
      console.log("error"); 
      valid = false;
    }
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var response = JSON.parse(request.responseText);
        for (var i = 0; i < response.length; i++) {
          var id = response[i].id;
          var ids = document.getElementsByClassName("id");
          var found = false;
          var j = 0;
          while(!found && j < ids.length) {
            if (id == Number(ids[j].innerHTML)) {
              found = true;
            }
            j++;
          }
          if (!found) {
            createRow(response[i]);  
          }
        }
      }
    }

    if (valid == true) {
      request.open('GET', '/newWorkout?name=' + name + '&reps=' + reps + '&weight=' + weight + '&date=' + date + '&lbs=' + lbs, true);
      request.send(null);
      document.getElementById('name').value = "";
      document.getElementById('reps').value = "";
      document.getElementById('weight').value = "";
      document.getElementById('date').value = "";
      document.getElementById('lbs').value = "";
    }
    event.preventDefault();
  });
}

function firstTable() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var response = JSON.parse(request.responseText);
      for (var i = 0; i < response.length; i++) {
        createRow(response[i]);
      }
    }
  }

  request.open('GET', 'newWorkout', true);
  request.send(null);
}

function createRow(data) {
  var id = data.id;
  var name = data.name;
  var date = data.date;
  var lbs = data.lbs;
  var reps = data.reps;
  var weight = data.weight;
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

  var deleteForm = document.createElement("FORM");
  var deleteFormId = document.createElement("INPUT");
  deleteFormId.className = "deleteId";
  deleteFormId.value = id;
  deleteForm.appendChild(deleteFormId);
  var deleteBtn = document.createElement("BUTTON");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.type = 'submit';
  deleteForm.appendChild(deleteBtn);

  // var editBtn = document.createElement("BUTTON");
  // editBtn.appendChild(document.createTextNode("Edit"));
  // editBtn.id = "edit";
  // update.appendChild(formId);
  // update.appendChild(editBtn);
  // update.appendChild(deleteBtn);


  row.appendChild(deleteForm);
  var table = document.getElementById('workouts');
  table.appendChild(row);     
  deleteBtn.addEventListener('click', function(x) {
    return function (id) {
      id.preventDefault();
      deleteRow(id);
    };
  }(deleteFormId.value)); 
}

function deleteRow(id) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var response = JSON.parse(request.responseText);
      console.log(response);
      var table = document.getElementById('workouts');
      var rowIds = document.getElementsByClassName('id');
      console.log(rowIds);
      var i = 0;
      var found = false
      while (!found && i < rowIds.length) {
        if (id == Number(rowIds[i].innerHTML)) {
          console.log(id, Number(rowIds[i].innerHTML));
          found = true;
        }
        i++;
      }
      if (found) {
        var row = rowIds[i].parentNode;
        table.removeChild(row); 
      }
    }
  }

  request.open('GET', '/deleteWorkout?id=' + id, true);
  request.send(null);
  event.preventDefault();

}
