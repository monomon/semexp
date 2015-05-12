describe('Semantic graph explorer', function () {
'use strict';
	var explorer;

	beforeEach(function () {
		explorer = Object.create(window.semexp);
		explorer.init({
			width : 800,
			height : 600
		});

		explorer.load(testData.musical);

		explorer.menu.applyData({
			filterRelation : 'isA',
			filterRelationToggle : true
		});
		// need to refresh manually - should this be done
		// when menu is updated?
		explorer.refresh();
	});

	afterEach(function () {
		explorer.clear();
		explorer = undefined;
	});

	it('contains the correct number of nodes', function () {
		var keys = Object.getOwnPropertyNames(testData.musical.entities);
		var nodeData = [];
		keys.reduce(function (previous, current) {
			if (previous && !testData.musical.relations.hasOwnProperty(current)) {
				previous.push(current);
			}

			return previous;
		}, nodeData);
		console.log(nodeData);
		console.log('expecting ' + nodeData.length + ' nodes');
		expect(document.querySelectorAll('.nodes .node').length).toEqual(nodeData.length);
	});

	it('contains the correct number of edges', function () {
		var keys = Object.getOwnPropertyNames(testData.musical.entities);
		var nodeData = [];
		keys.reduce(function (previous, current) {
			if (previous && testData.musical.entities[current].hasOwnProperty('isA')) {
				previous.push(current);
			}

			return previous;
		}, nodeData);
		console.log(nodeData);
		console.log('expecting ' + nodeData.length + ' edges');
		expect(document.querySelectorAll('.links .link').length).toEqual(nodeData.length);
	});

	// TODO: test interactions, also drag'n'drop

	// TODO: test menu
});