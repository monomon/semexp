document.addEventListener('DOMContentLoaded', function(evt) {
	'use strict';

	var explorer = Object.create(window.semexp);
	explorer.init({
		width : 800,
		height : 600
	});

	explorer.load({});
	explorer.addRelation('isA', { transitive : false, opposite : 'classOf' });
	explorer.addNode('musical instrument');

	explorer.addNode('idiophone');
	explorer.addLink('idiophone', 'isA', 'musical instrument');

	explorer.addNode('xylophone');
	explorer.addLink('xylophone', 'isA', 'idiophone');

	explorer.addNode('claves');
	explorer.addLink('claves', 'isA', 'idiophone');

	explorer.addNode('membranophone');
	explorer.addLink('membranophone', 'isA', 'musical instrument');

	explorer.addNode('djembe');
	explorer.addLink('djembe', 'isA', 'membranophone');

	explorer.addNode('darbuka');
	explorer.addLink('darbuka', 'isA', 'membranophone');

	explorer.addNode('chordophone');
	explorer.addLink('chordophone', 'isA', 'musical instrument');

	explorer.addNode('piano');
	explorer.addLink('piano', 'isA', 'chordophone');

	explorer.addNode('guitar');
	explorer.addLink('guitar', 'isA', 'chordophone');

	explorer.addNode('aerophone');
	explorer.addLink('aerophone', 'isA', 'musical instrument');

	explorer.addNode('flute');
	explorer.addLink('flute', 'isA', 'aerophone');

	explorer.addNode('trumpet');
	explorer.addLink('trumpet', 'isA', 'aerophone');

	explorer.menu.applyData({
		filterRelation : 'isA',
		filterRelationToggle : true
	});
	// need to refresh manually - should this be done
	// when menu is updated?
	explorer.refresh();
});
