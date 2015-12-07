document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('Update').addEventListener('click', function(event) {
    // When the Update button has been sent, create the payload with the updated values
    var request = new XMLHttpRequest();
    var payload = {id:null, name:null, reps:null, weight:null, date:null, lbs:null};
    payload.id = document.getElementById('id').value;
    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.date = document.getElementById('date').value;
    // Convert radio buttons into lbs: 1 || 0
    if (document.getElementById('lbs').checked){
      payload.lbs = 1;
    }
    else {
        payload.lbs = 0;
    }
    

    request.onreadystatechange = function() {
      if(request.readyState == 4 && request.status == 200) {
       // return to the main page
       window.location.href = 'Form.html';
      }
      
    }
    // Send post request to update the values with the values in the update form
    request.open('Post', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(payload));
    event.preventDefault();
  });
  event.preventDefault();
}); 
