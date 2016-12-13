// var text = document.querySelector('#text');


function switchView(elementId, string) {
	string = string || "Lobsta Roll";

	while ( content.childNodes.length > 0 ) {
		content.removeChild(content.firstChild);
	}

	// text.content.querySelector('p').innerHTML = string;

	var clone = document.importNode(elementId.content, true);
	content.appendChild(clone);
}

window.onload = function() {
	var content = document.querySelector('#content');

	var text = document.querySelector('#text');
	var image = document.querySelector('#image');

	text.content.querySelector('p').innerHTML = "BoggaYa";
	image.content.querySelector('img').src = "https://www.sencha.com/wp-content/uploads/2016/02/icon-sencha-test-studio.png";

	//document.querySelector('#tester').innerHTML = test;
	//document.querySelector('#imageTester').src = testImage;

// 	var t = document.querySelector('#mytemplate');
// // Populate the src at runtime.
// t.content.querySelector('img').src = 'logo.png';

// var clone = document.importNode(t.content, true);
// document.body.appendChild(clone);
}
