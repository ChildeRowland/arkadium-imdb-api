// template names
var aboutTemplate, searchTemplate, quizTemplate;
// store object from API
var data;
// current question
var question;
// user score, [correct, attemps]
var score = [0,0];

// clear the child elements from the content div
function clearView() {
	while ( content.childNodes.length > 0 ) {
		content.removeChild(content.firstChild);
	}
}

// remove active class from links
function removeActiveClass() {
	let elements = document.querySelectorAll('a');

	elements.forEach(function(el) {
		el.classList.remove('active');
	})
}

// clear the search input after use submits
function clearInput() {
	document.querySelector('#actor-name').value = '';
}

// check for user search input
function handleKeyPress(event) {
	if ( event.keyCode == 13 ) {
		searchApi();
	}
}

// VIEWS
// about the application
function aboutView(element) {
	clearView();
	removeActiveClass();
	element.classList.add('active');

	let clone = document.importNode(aboutTemplate.content, true);
	content.appendChild(clone);
}

// show the search input
function searchView(element) {
	clearView();
	removeActiveClass();
	element.classList.add('active');

	let clone = document.importNode(searchTemplate.content, true);
	content.appendChild(clone);
}

// quiz
function quizView(element) {
	clearView();
	removeActiveClass();
	element.classList.add('active');

	if ( data ) {
		let question = randomDataEntry();

		quizTemplate.content.querySelector('p').innerHTML = question.title;
	} else {
		quizTemplate.content.querySelector('p').innerHTML = "Search for your favorite actor before taking the quiz";
	}

	let clone = document.importNode(quizTemplate.content, true);
	content.appendChild(clone);
}

// send a request to the server and handle the results
function searchApi() {
	let actor = encodeURIComponent(document.querySelector('#actor-name').value);
	let url = window.location.href + 'search' + '?actor=' + actor;

	let http = new XMLHttpRequest();

	http.open('GET', url);

	http.onreadystatechange = function () {
		if (this.readyState === this.DONE && http.status === 200) {

			data = JSON.parse(this.responseText);
			console.log(data);

		} else if ( http.readyState == XMLHttpRequest.DONE && http.status !== 200 ) {
			console.log('error');
			// show some actor names
		}
	};

	http.send();

	clearInput();
}

// return a random movie for the quiz
function randomDataEntry() {
	let count = data.results[0].known_for.length;
	let idx = Math.floor(Math.random() * count);
	let question = data.results[0].known_for[idx];
	data.results[0].known_for[idx] = false;
	return question;
}

window.onload = function() {
	// global variables for templates views 
	var content = document.querySelector('#content');
	aboutTemplate = document.querySelector('#about');
	searchTemplate = document.querySelector('#search');
	quizTemplate = document.querySelector('#quiz');
}


// remove for deployment 
function switchView(elementId, string) {
	clearView();

	string = string || 'Lobsta Roll';

	text.content.querySelector('p').innerHTML = string;

	var clone = document.importNode(elementId.content, true);
	content.appendChild(clone);
}

// image.content.querySelector('img').src = 'https://www.sencha.com/wp-content/uploads/2016/02/icon-sencha-test-studio.png';



