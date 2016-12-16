// main view for templates
var content;
// template names
var aboutTemplate, searchTemplate, quizTemplate;
// store object from API
var actors, data;
// current question
var question;
// user score, [correct, attemps]
var score = [0,0];
// format imdb image
var imageFormat = 'https://image.tmdb.org/t/p/';

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
		quizTemplate.content.querySelector('img').src = imageFormat+'/w500/'+question.poster_path;
		quizTemplate.content.querySelector('img').classList.remove('hidden');
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

			actors = JSON.parse(this.responseText);
			console.log(actors);

			addImgSearch();

		} else if ( http.readyState == XMLHttpRequest.DONE && http.status !== 200 ) {
			console.log('error');
			// show some actor names
		}
	};

	http.send();

	clearInput();
}

function addImgSearch() {
	// limit the number of results
	let maxIdx = Math.min(5, actors.results.length);
	// iterate through the results and render profile picture
	for ( let i = 0; i < maxIdx; i++) {
		let img = new Image();
		img.src = imageFormat+'/w185/'+actors.results[i].profile_path;
		img.className = 'profile-picture';
		img.onclick = function(){getActor(actors.results[i].id)};
		content.appendChild(img);
	}
}

function getActor(id) {
	console.log(id);

	let url = window.location.href + 'actor/' + id;
	console.log(url);
	let http = new XMLHttpRequest();

	http.open('GET', url);

	http.onreadystatechange = function () {
		if (this.readyState === this.DONE && http.status === 200) {

			data = JSON.parse(this.responseText);
			console.log(data);

			quizView(quizTemplate);

		} else if ( http.readyState == XMLHttpRequest.DONE && http.status !== 200 ) {
			console.log('error');
			// show some actor names
		}
	};

	http.send();
}

// return a random movie for the quiz
function randomDataEntry() {
	let count = data.cast.length;
	let idx = Math.floor(Math.random() * count);
	let question = data.cast[idx];
	data.cast[idx] = false;
	return question;
}

window.onload = function() {
	// assign variables for templates views
	content = document.querySelector('#content');
	aboutTemplate = document.querySelector('#about');
	searchTemplate = document.querySelector('#search');
	quizTemplate = document.querySelector('#quiz');

	aboutView(document.querySelector('#default-view'));
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

// document.addEventListener('DOMContentLoaded', init);


