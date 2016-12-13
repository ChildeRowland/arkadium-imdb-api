
var data; // store object from API
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

	string = string || "Lobsta Roll";

	text.content.querySelector('p').innerHTML = string;

	var clone = document.importNode(elementId.content, true);
	content.appendChild(clone);
}

// view search results
function searchView(elementId) {
	clearView();

	var http = new XMLHttpRequest();
	var url = window.location.href + 'search';
	var method = 'GET';

	http.open(method, url);
	http.onreadystatechange = function() {
		if ( http.readyState === XMLHttpRequest.DONE && http.status === 200 ) {
			data = JSON.parse(http.responseText);

			elementId.content.querySelector('p').innerHTML = data;
			var clone = document.importNode(elementId.content, true);
			content.appendChild(clone);

			console.log(data);
		} else if ( http.readyState == XMLHttpRequest.DONE && http.status !== 200 ) {
			// add redirect for no values found
			console.log('Error');
		} 
	}

	http.send();
}

function randomDataEntry() {
	// get the results array length
	// randomly pick a number, save it somewhere
	// set the image and the title
}

window.onload = function() {
	// global variables for templates
	var content = document.querySelector('#content');
	var aboutTemplate = document.querySelector('#about');
	var text = document.querySelector('#text');
	var image = document.querySelector('#image');
	var searchTemplate = document.querySelector('#search');

	text.content.querySelector('p').innerHTML = "BoggaYa";
	image.content.querySelector('img').src = "https://www.sencha.com/wp-content/uploads/2016/02/icon-sencha-test-studio.png";

}




