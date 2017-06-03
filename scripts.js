var dateTypeId = 2;
var database = firebase.database();

function writeUserData(id, message, datetime, recurring) {
  firebase.database().ref('tweets/' + id).set({
    message: message,
    datetime: datetime,
    recurring: recurring
  });
}

function getMessages() {
	fetch('./messages.json')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
				for (let i = 0; i < data.length; i++) {
					addNewMessage(data[i].message);
				}
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function displayInfo(obj) {
  var message = obj.parentNode;
  var date = message.querySelector(".datetime").value;
  var info = message.querySelector(".datetime-info");
  var repeat = message.querySelector(".repeat").value;
  var text = "";

  if (date === "") {
    info.innerHTML = "Date and time are required.";
    return;
  }

	var id = message.dataset.type;
	console.log(id);
	var m = message.querySelector("textarea").value;
	var d = date;
	var r = repeat;
	// write to database
	writeUserData(id, m, d, r);

  text = formatDisplayDate(date);

  if (repeat !== "") {
    text += " recurring " + repeat + ".";
  }

  info.innerHTML = text;
}

function formatDisplayDate(date) {
  date = date.replace("T", " ");
  return date;
}

function lastSent() {}
function nextSend() {}

function addNewMessage(message) {
	if (message === undefined) {
		message = "";
	}
  var messages = document.getElementById("messages");

  messages.innerHTML += `
  <div data-type="${dateTypeId}" class="message">
    <textarea maxlength='140'>${message}</textarea>
    <input class='datetime' type='datetime-local'>
    <select class='repeat'>
      <option value='' selected>not recurring</option>
      <option value='daily'>daily</option>
      <option value='weekly'>weekly</option>
      <option value='monthly'>monthly</option>
    </select>
    <button onclick="displayInfo(this);">set</button>
    <p class='datetime-info'>not set</p>
    <button id="${dateTypeId}" onclick="deleteMessage(this)">Delete</button>
    <hr>
  </div>`;

  dateTypeId++;
}

function deleteMessage(obj) {
  document.querySelector(`[data-type='${obj.id}']`).remove();
}
