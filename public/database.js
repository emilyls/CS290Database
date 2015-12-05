document.addEventListener('DOMContentLoaded', bindButton);

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
        ///var par = document.createElement("p");
        //var info = document.createTextNode(response);
        //par.appendChild(info);
        
        console.log(response);
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

