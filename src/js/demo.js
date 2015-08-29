document.addEventListener('DOMContentLoaded', function(evt) {
	'use strict';

	var explorer = Object.create(window.semexp);
	explorer.init();

	explorer.load(testData.musical);

	explorer.menu.relationWidgets[1].setValue([['isA']]);
	explorer.refresh();
});
