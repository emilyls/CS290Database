document.addEventListener('DOMContentLoaded', bindButton);
document.addEventListener('DOMContentLoaded', firstTable);


function bindButton() {
  document.getElementById('newWorkout').addEventListener('click', function(event) {
    var request = new XMLHttpRequest();
    var valid = true;
    var name = document.getElementById('name').value;
    var reps = document.getElementById('reps').value;
    var weight = document.getElementById('weight').value;
    var date = document.getElementById('date').value;
    var lbs = document.getElementById('lbs').value;
    console.log(lbs);
    if (name == "" || reps == null || weight == null || date == null) {
      console.log("cannot submit with no name"); 
      valid = false;
    }
    if (lbs == null) {
      lbs = 0;
    }
    else {
      lbs = 1;
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
  var rowId = data.id;
  var name = data.name;
  var date = data.date;
  if(date != "0000-00-00") {
    var formattedDate = new Date(date);
    formattedDate = formattedDate.toJSON();
    date = formattedDate.substring(0,10);
  }
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
  idCell.appendChild(document.createTextNode(rowId));
  idCell.className = "id";
  idCell.type = "hidden";
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
  deleteFormId.value = rowId;
  deleteFormId.type = "hidden";
  deleteForm.appendChild(deleteFormId);
  var deleteBtn = document.createElement("BUTTON");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.type = 'submit';
  deleteForm.appendChild(deleteBtn);
  row.appendChild(deleteForm);
  var table = document.getElementById('workouts');
  table.appendChild(row);

  deleteBtn.addEventListener('click', function(x) {
    var id = x;
    return function () {
      console.log(id);
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
            var row = rowIds[i-1].parentNode;
            table.removeChild(row); 
          }
        }
      }
      request.open('GET', '/deleteWorkout?id=' + id, true);
      request.send(null);
      event.preventDefault();
    };
  }(deleteFormId.value)); 

  var editForm = document.createElement("FORM");
  editForm.action ="/";
  editForm.method = "POST";

  var editFormId = document.createElement("INPUT");
  editFormId.className = "editId";
  editFormId.value = rowId;
  editFormId.name ="id";
  editFormId.type = "hidden";
  editForm.appendChild(editFormId);

  var editBtn = document.createElement("INPUT");
  editBtn.innerHTML = "Edit";
  editBtn.name = "Edit";
  editBtn.value ="Edit";
  editBtn.type = 'submit';
  editForm.appendChild(editBtn);

  row.appendChild(editForm);
  var table = document.getElementById('workouts');
  table.appendChild(row);   
}

