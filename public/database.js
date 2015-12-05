document.addEventListener('DOMContentLoaded', bindButton);

function bindButton() {
	document.getElementById('newWorkout').addEventListener('click', function(event){
		var request = new XMLHttpRequest();
		var payload = {name:null, reps:null,weight:null, date:null, lbs:null};
		payload.name = document.getElementById('name').value;
		payload.reps = document.getElementById('reps').value;
		payload.weight = document.getElementById('weight').value;
		payload.date = document.getElementById('date').value;
		payload.lbs = document.getElementById('lbs').value;

		
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				var response = JSON.parse(request.responseText);
				var data = JSON.parse(response.data);
				// document.getElementById('dataReturned').textContent = "Name: " + data.userName + "\tAge: " + data.userAge;
				console.log(data)
			}
		}

		request.open('Post', 'http://52.88.123.171:5000/newWorkout', true);
		//request.setRequestHeader('Content-Type', 'application/json');

		request.send(JSON.stringify(payload));

		document.getElementById('name').value = "";
		document.getElementById('reps').value = "";
		document.getElementById('weight').value = "";
		document.getElementById('date').value = "";
		document.getElementById('lbs').value = "";
		event.preventDefault();
	});
	
}

