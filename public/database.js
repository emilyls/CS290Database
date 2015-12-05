document.addEventListener('DOMContentLoaded', bindButton);
document.addEventListener('DOMContentLoaded', createTable);

function createTable() {
	var request = new XMLHttpRequest();
	if (request.readyState == 4 && request.status == 200) {
		console.log("empty table");
	}
	request.open('GET', 'http://52.88.123.171:5000/reset-table', true);
	request.send(null);
	event.preventDefault();
}

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
				//var data = JSON.parse(response.data);
				// document.getElementById('dataReturned').textContent = "Name: " + data.userName + "\tAge: " + data.userAge;
				//console.log(data)
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

