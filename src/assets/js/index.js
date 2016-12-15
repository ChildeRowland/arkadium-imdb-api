var quizTemplate;
var data; // store object from API
var question // current question
var score = [0,0];

// clear the child elements from the content div
function clearView() {
	while ( content.childNodes.length > 0 ) {
		content.removeChild(content.firstChild);
	}
}

function aboutView(elementId) {
	clearView();

	let clone = document.importNode(elementId.content, true);
	content.appendChild(clone);
}

function switchView(elementId, string) {
	clearView();

	string = string || 'Lobsta Roll';

	text.content.querySelector('p').innerHTML = string;

	var clone = document.importNode(elementId.content, true);
	content.appendChild(clone);
}

function handleKeyPress(event) {
	if ( event.keyCode == 13 ) {
		searchView();
	}
}

function clearInput() {
	document.querySelector('#actor-name').value = '';
}

// view search results
function searchView() {

	var actor = encodeURIComponent(document.querySelector('#actor-name').value);
	var results = '{}';
	var http = new XMLHttpRequest();

	http.open('GET', 'https://api.themoviedb.org/3/search/person?query='+actor+'&api_key=b2b35ce19b736641a658c422c9d537a7');

	http.onreadystatechange = function () {
		if (this.readyState === this.DONE && http.status === 200) {

			data = JSON.parse(this.responseText);
			console.log(data);

		} else if ( http.readyState == XMLHttpRequest.DONE && http.status !== 200 ) {
			console.log('error');
		}
	};

	http.send(results);
	clearInput();
}

function quizView() {
	clearView();

	let question = randomDataEntry();

	quizTemplate.content.querySelector('p').innerHTML = question.title;
	var clone = document.importNode(quizTemplate.content, true);
	content.appendChild(clone);
}

function randomDataEntry() {
	let count = data.results[0].known_for.length;
	let idx = Math.floor(Math.random() * count);
	let question = data.results[0].known_for[idx];
	data.results[0].known_for[idx] = false;
	return question;
}

window.onload = function() {
	// global variables for templates
	var content = document.querySelector('#content');
	var aboutTemplate = document.querySelector('#about');
	var text = document.querySelector('#text');
	var image = document.querySelector('#image');
	quizTemplate = document.querySelector('#quiz');

	text.content.querySelector('p').innerHTML = 'BoggaYa';
	image.content.querySelector('img').src = 'https://www.sencha.com/wp-content/uploads/2016/02/icon-sencha-test-studio.png';
}




