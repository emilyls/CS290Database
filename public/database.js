document.addEventListener('DOMContentLoaded', bindButton);
document.addEventListener('DOMContentLoaded', firstTable);


function firstTable() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var response = JSON.parse(request.responseText);
      for (var i = 0; i < response.length; i++) {
        // Build table row-by-row when page is loaded
        createRow(response[i]);
      }
    }
  }
  request.open('GET', 'createTable', true);
  request.send(null);
  event.preventDefault();
}

function bindButton() {
  document.getElementById('newWorkout').addEventListener('click', function(event) {
    var request = new XMLHttpRequest();
    var valid = true;
    var name = document.getElementById('name').value;
    var reps = document.getElementById('reps').value;
    var weight = document.getElementById('weight').value;
    var date = document.getElementById('date').value;
    var lbs = document.getElementById('lbs').value;
    // Ensure that all fields hold a value
    if (name == "" || reps == "" || weight == "" || date == "") {
      console.log("cannot submit incomplete"); 
      valid = false;
    }
    if (lbs == "lbs") {
      lbs = 1;
    }
    else {
      lbs = 0;     // Kilograms
    }
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var response = JSON.parse(request.responseText);
        // Look at each row returned from MySQL db
        for (var i = 0; i < response.length; i++) {
          var responseId = response[i].id;
          var ids = document.getElementsByClassName("id");
          var found = false;
          var j = 0;
          // Compare to each row already in the table
          while(!found && j < ids.length) {
            if (responseId == Number(ids[j].innerHTML)) {
              found = true;
            }
            j++;
          }
          // If the returned row is not already in the table, add it
          if (!found) {
            createRow(response[i]);  
          }
        }
      }
    }

    // When the submit button is pressed, send a GET request to update the database
    if (valid == true) {
      request.open('GET', '/newWorkout?name=' + name + '&reps=' + reps + '&weight=' + weight + '&date=' + date + '&lbs=' + lbs, true);
      request.send(null);
      // Clear the fields in the form
      document.getElementById('name').value = "";
      document.getElementById('reps').value = "";
      document.getElementById('weight').value = "";
      document.getElementById('date').value = "";
      document.getElementById('lbs').value = "";
    }
    event.preventDefault();
  });
}

function createRow(data) {
  var idCell = document.createElement("TD");
  idCell.innerHTML = data.id;
  idCell.className = "id";       // Allows CSS to hide the cell
  
  var nameCell = document.createElement("TD");
  nameCell.innerHTML = data.name;
  
  var repsCell = document.createElement("TD");
  repsCell.innerHTML = data.reps;
  
  var weightCell = document.createElement("TD");
  weightCell.innerHTML = data.weight;
  
  var date = data.date;
  if(date != "0000-00-00") {
    // Convert the date returned from MySQL to a Javascript Date object
    var formattedDate = new Date(date);
    // Format date in JSON format
    formattedDate = formattedDate.toJSON();
    // Parse out string YYYY-MM-DD
    date = formattedDate.substring(0,10);
  }
  var dateCell = document.createElement("TD");
  dateCell.innerHTML = date;

  // Display Unit as Pounds or Kilos rather than Pounds 1 | 0
  var lbs = data.lbs;
  var lbsCell = document.createElement("TD");
  if (lbs == 1) {
    lbsCell.innerHTML = "Pounds";
  }
  else {
    lbsCell.innerHTML = "Kilos";
  }

  // Add new values to the Row
  var row = document.createElement("TR");
  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(repsCell);
  row.appendChild(weightCell);
  row.appendChild(dateCell);
  row.appendChild(lbsCell);

  // Create form to handle delete button
  var deleteForm = document.createElement("FORM");
  var deleteFormId = document.createElement("INPUT");
  // Add row ID to delete form
  deleteFormId.className = "deleteId";
  deleteFormId.value = data.id;
  deleteFormId.type = "hidden";         // Hide ID
  deleteForm.appendChild(deleteFormId);
  // Add delete button to form
  var deleteBtn = document.createElement("BUTTON");
  deleteBtn.innerHTML = "Delete";       // Button Label
  deleteBtn.type = 'submit';
  deleteForm.appendChild(deleteBtn);
  var deleteCell = document.createElement("TD");
  deleteCell.appendChild(deleteForm);
  // Add form to row
  row.appendChild(deleteCell);

  // Add row to table
  var table = document.getElementById('workouts');
  table.appendChild(row);

  // Listen for Delete button to be clicked
  deleteBtn.addEventListener('click', function(x) {
    var id = x;
    return function () {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          var response = JSON.parse(request.responseText);
          // Find the correct row in the table
          var table = document.getElementById('workouts');
          var rowIds = document.getElementsByClassName('id');
          var i = 0;
          var found = false
          // Commpare the desired id to each of the row IDs
          while (!found && i < rowIds.length) {
            if (id == Number(rowIds[i].innerHTML)) {
              found = true;
            }
            i++;
          }
          // If the row is found, delete it
          if (found) {
            var row = rowIds[i-1].parentNode;    // i has been incremented once after the desired ID was found
            table.removeChild(row); 
          }
        }
      }
      // When button is clicked send a get request with the ID of the row to delete
      request.open('GET', '/deleteWorkout?id=' + id, true);
      request.send(null);
      event.preventDefault();
    };
  }(deleteFormId.value)); // pass the function the actual row ID


  // Add form with edit button
  var editForm = document.createElement("FORM");
  editForm.action ="/";
  editForm.method = "POST";

  // Append the ID to the form
  var editFormId = document.createElement("INPUT");
  editFormId.className = "editId";
  editFormId.value = data.id;
  editFormId.name ="id";
  editFormId.type = "hidden";           // Hide the ID
  editForm.appendChild(editFormId);

  // Append the button to the form, which will submit via POST when clicked
  var editBtn = document.createElement("INPUT");
  editBtn.innerHTML = "Edit";
  editBtn.name = "Edit";
  editBtn.value ="Edit";
  editBtn.type = "submit";
  editForm.appendChild(editBtn);

  // Add the form to the row
  var editCell = document.createElement("TD");
  editCell.appendChild(editForm);
  row.appendChild(editCell);
  var table = document.getElementById('workouts');
  table.appendChild(row);   
}

