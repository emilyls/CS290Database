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

            var update = document.createElement("FORM");
            var formId = document.createElement("P");
            formId.textContent = id.toString();
            formId.id = "formId";
            var editBtn = document.createElement("BUTTON");
            editBtn.appendChild(document.createTextNode("Edit"));
            editBtn.id = "edit";
            var deleteBtn = document.createElement("BUTTON");
            deleteBtn.appendChild(document.createTextNode("Delete"));
            deleteBtn.id = "delete";
            deleteBtn.onclick = deleteRow; 
            update.appendChild(formId);
            update.appendChild(editBtn);
            update.appendChild(deleteBtn);
            row.appendChild(update);

            var table = document.getElementById('workouts');
            table.appendChild(row);
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

function deleteRow(event) {
//  document.getElementById('delete').addEventListener('click', function(event) {
    var request = new XMLHttpRequest();

    console.log(event);
    var button = event.target;
//    var form = event.parentNode;
//    console.log(form);
    var found = false;
//   var row;
//    while (button.previousSibling.id != "formId") {
//      formId = button.previousSibling;
//    }

//    var table = document.getElementById('workouts');
//    for (var i = 0; i < table.rows.length; i++) {
//      var cells = table.row[i].childNodes;
//      var id = cells.getElementById("id");
//      if (Number(id.innerHTML) == formId) {
//        row = table.row[i];
//        found = true;
//        break;
//      }
//    }

//    request.onreadystatechange = function() {
//      if (request.readyState == 4 && request.status == 200) {
//        var response = JSON.parse(request.responseText);
//        console.log(response);
//      }
//    }

    if (found == true) {
      request.open('GET', '/deleteWorkout?id=' + id, true);
      request.send(null);
      table.removeChild(row); 
    }
    event.preventDefault();
 // });
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

        var update = document.createElement("FORM");
        var formId = document.createElement("P");
        formId.textContent = id.toString();
        formId.id = "formId";
        var editBtn = document.createElement("BUTTON");
        editBtn.appendChild(document.createTextNode("Edit"));
        editBtn.id = "edit";
        var deleteBtn = document.createElement("BUTTON");
        deleteBtn.appendChild(document.createTextNode("Delete"));
        deleteBtn.id = "delete";
        deleteBtn.onclick = deleteRow; 
        update.appendChild(formId);
        update.appendChild(editBtn);
        update.appendChild(deleteBtn);
        row.appendChild(update);
        var table = document.getElementById('workouts');
        table.appendChild(row);
}