document.addEventListener('DOMContentLoaded', function(evt) {
	'use strict';

	var explorer = Object.create(window.semexp);
	explorer.init({
		width : 800,
		height : 600
	});

	var data = {
		'entities': {
			'is': {},
			'mp': {
				'contains': [
					'Hristo',
					'Pe6o'
				]
			},
			'Hristo': {
				'is': [
					'mp'
				],
				'knows': [
					'Pe6o'
				]
			},
			'knows': {},
			'Pe6o': {
				'is': [
					'mp'
				]
			}
		},
		'relations': {
			'is': {
				'transitive': true,
				'opposite': 'contains'
			},
			'contains': {
				'transitive': true,
				'opposite': 'is'
			},
			'knows': {
				'transitive': false,
				'opposite': 'knows'
			}
		}
	};

	explorer.load(data);
});
