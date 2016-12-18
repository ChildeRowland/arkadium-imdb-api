// main view for templates
var content;
// template names
var aboutTemplate, searchTemplate, quizTemplate, scoreTemplate;
// store object from API
var actors, data;
// current question
var question;
// user score, [correct, attemps]
var score = [];
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

// check for broken image paths
function hideBrokenImage(element) {
	element.style.display='none';
}

// check for user search input
function submitFromUser(event, callback) {
	if ( event.keyCode == 13 ) {
		clearSearch(event.target);
		callback();
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

	if ( data && data.cast.length > 0 ) {
		if ( !question ) {
			question = randomDataEntry();

			quizTemplate.content.querySelector('p').innerHTML = question.title;
			quizTemplate.content.querySelector('img').src = imageFormat+'/w500/'+question.poster_path;
			quizTemplate.content.querySelector('img').classList.remove('hidden');
			quizTemplate.content.querySelector('input').classList.remove('hidden');
		}
	} else {
		quizTemplate.content.querySelector('p').innerHTML = "Search for your favorite actor before taking the quiz";

		quizTemplate.content.querySelector('img').classList.add('hidden');
		quizTemplate.content.querySelector('input').classList.add('hidden');
	}

	let clone = document.importNode(quizTemplate.content, true);
	content.appendChild(clone);
}

// score
function scoreView(element) {
	clearView();
	removeActiveClass();
	element.classList.add('active');

	let total = [0,0];

	if ( score.length > 0 ) {
		score.forEach(function (arr) {
			total[0] += arr[1] // correct;
			total[1] += arr[2] // attempts
		})
	}

	let p = document.createElement('P');
	p.innerHTML = total.join(' correct out of ');
	//scoreTemplate.appendChild(p);

	let clone = document.importNode(scoreTemplate.content, true);
	content.appendChild(clone);
	content.appendChild(p);
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
	// create a div to hold to images
	let div = document.createElement('DIV');
	div.className = 'photo-back-drop';
	content.appendChild(div);
	// append a p tag for instruction
	let paragraph = document.createElement('P');
	paragraph.innerHTML = "Click a photo to select an actor:"
	div.appendChild(paragraph);

	// limit the number of results
	let maxIdx = Math.min(5, actors.results.length);
	// iterate through the results and render profile picture
	for ( let i = 0; i < maxIdx; i++) {
		let actorId = actors.results[i].id;
		let actorName = actors.results[i].name
		let img = new Image();

		img.src = imageFormat+'/w185/'+actors.results[i].profile_path;
		img.className = 'profile-picture';
		img.onerror = function(){ hideBrokenImage(img) }; // check for broken image path
		img.onclick = function(){ getActor(actorId, actorName) };
		div.appendChild(img);
	}
}

function clearSearch(child) {
	let div = child.parentElement;
	// delete actor search results
	if ( div.class === 'photo-back-drop' ) {
		content.removeChild(div);
	}
}

function getActor(id, name) {
	question = null;
	score.push([name, 0, 0]);

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

function checkAnswer() {
	let correctAnswer = false;
	let userAnswer = event.target.value.toString();
	let idx = score.length - 1;

	let element = document.querySelector('#correct-answer');

	if ( question.release_date ) {
		let year = question.release_date.slice(0,4);

		if ( userAnswer === year ) {
			correctAnswer = true;
		}

		if ( correctAnswer ) {
			score[idx][1]++;
		}

		score[idx][2]++;
	}
	
	console.log(userAnswer, question.release_date, idx);
	console.log(score);

	let text = `${correctAnswer}! Released in ${question.release_date.slice(0,4)}`

	element.classList.remove('hidden');
	element.querySelector('p').innerHTML = text;

	setTimeout(function() {
		element.classList.add('hidden');
		question = null;
		quizView(quizTemplate);
	}, 2500);
}

// return a random movie for the quiz
function randomDataEntry() {
	let count = data.cast.length;
	let idx = Math.floor(Math.random() * count);
	let question = data.cast[idx];
	data.cast.splice(idx,1); // remove entry from array
	return question;
}

window.onload = function() {
	// assign variables for templates views
	content = document.querySelector('#content');
	aboutTemplate = document.querySelector('#about');
	searchTemplate = document.querySelector('#search');
	quizTemplate = document.querySelector('#quiz');
	scoreTemplate = document.querySelector('#score');

	aboutView(document.querySelector('#default-view'));
}

// remove for deployment 

// function switchView(elementId, string) {
// 	clearView();

// 	string = string || 'Lobsta Roll';

// 	text.content.querySelector('p').innerHTML = string;

// 	var clone = document.importNode(elementId.content, true);
// 	content.appendChild(clone);
// }

// image.content.querySelector('img').src = 'https://www.sencha.com/wp-content/uploads/2016/02/icon-sencha-test-studio.png';

// document.addEventListener('DOMContentLoaded', init);


