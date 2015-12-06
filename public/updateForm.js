document.addEventListener('DOMContentLoaded', bindButton);
function bindButton() {
  document.getElementById('Update').addEventListener('click', function(event) {
    console.log("In Event Listener");
    var request = new XMLHttpRequest();
    var payload = {id:null, name:null, reps:null, weight:null, date:null, lbs:null};
    payload.id = document.getElementById('id').value;
    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.date = document.getElementById('date').value;
    payload.lbs = document.getElementById('lbs').value;
    if (payload.lbs == "lbs") {
        payload.lbs = 1;
    }
    else {
        payload.lbs = 0;
    }

    request.onreadystatechange = function() {
      console.log("In ready state change");
      if(request.readyState == 4 && request.status == 200) {
       window.location.href = 'Form.html';
      }
      
    }
    request.open('Post', '/', true);
    //request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(payload));
    event.preventDefault();
  });
} 
