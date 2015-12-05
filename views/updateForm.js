document.addEventListener('DOMContentLoaded', bindButton);
function bindButton() {
  document.getElementById('Update').addEventListener('click', function(event) {
    var request = new XMLHttpRequest();
    var payload = {id:null, name:null, reps:null, weight:null, date:null, lbs:null};
    payload.id = document.getElementById('id').value;
    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.date = document.getElementById('date').value;
    payload.lbs = document.getElementById('lbs').value;

    request.onreadystatechange = function() {
      if(request.readyState == 4 && request.status == 200) {
        var response = JSON.parse(request.responseText);
        var newPage = new XMLHttpRequest();
        newpage.open('GET', '/newWorkout', true);
      }
      
      request.open('Post', '/', true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(payload));

    }
  });
} 