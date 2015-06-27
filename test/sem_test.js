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
		var nodeData = keys.reduce(function (previous, current) {
			if (previous && testData.musical.entities[current].hasOwnProperty('isA')) {
				previous.push(current);
			}

			return previous;
		},[]);
		console.log(nodeData);
		console.log('expecting ' + nodeData.length + ' edges');

		explorer.model.updateFilterData({
			relations : [[{ value : 'isA', tokenHTML : 'isA'}]]
		});

		expect(document.querySelectorAll('.links .link').length).toEqual(nodeData.length);
	});

	it('filters nodes correctly', function () {
		var keys = Object.getOwnPropertyNames(testData.musical.entities);
		// filter nodes manually for the expected data
		var nodeData = keys.reduce(function (previous, current) {
			if (previous && !testData.musical.relations.hasOwnProperty(current) &&
				testData.musical.entities[current].hasOwnProperty('isA') &&
				testData.musical.entities[current].isA.indexOf('musical instrument') >= 0) {
				previous.push(current);
			}

			return previous;
		}, []);

		// now update filter
		explorer.model.updateFilterData({entities : [[{
			value : 'isA',
			tokenHTML : 'isA'
		}, {
			value : 'musical instrument',
			tokenHTML : 'musical instrument'
		}]]});

		console.log(nodeData);
		console.log('expecting ' + nodeData.length + ' nodes');
		// add one for the 'musical instrument' node. Still need to clarify this behavior
		expect(document.querySelectorAll('.nodes .node').length).toEqual(nodeData.length);
	});

	// TODO: test interactions, also drag'n'drop

	// TODO: test menu

	// test model
});