document.addEventListener('DOMContentLoaded', function(evt) {
	'use strict';

	var explorer = Object.create(window.semexp);
	explorer.init({
		width : 800,
		height : 600
	});

	req.send(null, {
		method : 'GET',
		url : 'http://localhost:3000/data'
	}).then(
	function (data) {
		explorer.load(data);
	},
	function (error) {
		console.log(error);
	});
});
