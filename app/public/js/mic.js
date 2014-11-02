document.addEventListener('DOMContentLoaded', function(evt) {
	'use strict';

	var explorer = Object.create(window.semexp);
	explorer.init({
		width : 800,
		height : 600
	});

	// load the data, then draw
	req({
		method : 'GET',
		url : 'http://localhost:3000/data'
	}).then(
		function (evt) {
			// drawGraph(JSON.parse(evt.target.responseText));
			explorer.loadData(JSON.parse(evt.target.responseText));
			explorer.draw();
		},
		function (error) {
			console.log(error);
		}
	);
});
