document.addEventListener('DOMContentLoaded', function(evt) {
	'use strict';

	var explorer = Object.create(window.semexp);
	explorer.init({
		width : 800,
		height : 600
	});

	explorer.load();
});
