(function(semexp) {
	'use strict';

	/**
	 * @lends semexp
	 */
	semexp = {
		/**
		 * @classdesc Semantic explorer,
		 * an experiment in navigating semantic networks
		 * <ul>
		 * <li>display a semantic network in a graph  with a force-directed layout</li>
		 * </ul>
		 * @todo
		 * <ul>
		 * <li>allow arbitrary filters on the data</li>
		 * <ul>
		 * 	<li>filter relations to show as arrows from a list</li>
		 * 	<li>filter entities which have certain relations defined (how to make this flexible?)</li>
		 * 	<li>allow both from menu and from a cli</li>
		 * </ul>
		 * <li>tools for manipulating the data, e.g.:</li>
		 * <ul>
		 * 	<li>add node - enter node details, name at a minimum</li>
		 * 	<li>add link - perhaps choose from a dropdown with limited options, e.g. relations that have already been defined in the model</li>
		 * 	<li>modify node - metadata, relations</li>
		 * </ul>
		 * <li>extend the database class:</li>
		 * <li>be able to add more data on a node (might be possible already?), e.g. an object or map</li>
		 * <li>implement loading and saving directly inside the semnet class; push changes to a remote (regardless if it's a server or another client)</li>
		 * </ul>
		 * @constructs
		 */
		init : function(config)
		{
			// inject explorer into components to be able
			// to call methods directly
			var subcomponents = ['graph', 'tools', 'menu', 'model'];

			for (var i = 0; i < subcomponents.length; i++) {
				this[subcomponents[i]] = Object.create(semexp[subcomponents[i]], {
					explorer : { value : this }
				});
			}

			var body = d3.select('body');
			this.svg = d3.select('body').append('svg')
				.attr('width', body.property('clientWidth'))
				.attr('height', body.property('clientHeight'));
		},

		/**
		 * Add a node to the network and refresh
		 * @param {String} nodeName
		 */
		addNode : function(nodeName)
		{
			this.model.add(nodeName);
			// add default fact
			if (this.model.defaultFact) {
				for (var i = 0; i < this.model.defaultFact.length; i++) {
					this.model.fact(
						nodeName,
						this.model.defaultFact[i][0].value,
						this.model.defaultFact[i][1].value
					);
				}
			}

			this.tools.setData('fromNode', null);
			this.refresh();
		},

		/**
		 * Add a relation type
		 * @param {String} relNamee
		 * @param {Object} options Additional options
		 */
		addRelation : function(relName, options)
		{
			this.model.add(relName, options);
			this.refresh();
		},

		/**
		 * Add a fact triplet
		 * @param {String} from Source node id
		 * @param {String} link Relation id
		 * @param {String} to Target node id
		 */
		addFact : function(from, link, to)
		{
			if (from == to) {
				return;
			}

			this.model.fact(from, link, to);
			this.tools.setData('fromNode', null);
			// append link to the data?
			this.refresh();
		},

		/**
		 * Remove a node
		 * @fixme: unimplemented
		 */
		removeNode : function(nodeName)
		{
			throw new Exception("unimplemented");
		},

		/**
		 * Refresh the explorer - each of its subcomponents
		 */
		refresh : function()
		{
			// this hooks the tick handler; perhaps move elsewhere
			this.menu.refresh();
			this.graph.refresh(this.model.generateGraph(), [this.tools]);
			this.tools.refresh();
		},

		/**
		 * Draw the explorer
		 */
		draw : function()
		{
			// clean svg
			this.menu.draw();
			this.graph.draw(
				this.model.generateGraph(),
				this.svg,
				[this.tools],
				this.menu.getData());
			this.tools.draw(this.svg);
			// this.cli.draw();
		},

		/**
		 * Save the data of the current graph
		 */
		save : function()
		{
			console.log(this.model.export());
		},

		/**
		 * Load data and draw its graph
		 * @param {Object} data
		 */
		load : function(data)
		{
			this.model.loadData(data);
			this.draw();
		},

		/**
		 * Clear the explorer.
		 * Clean up subcomponents
		 */
		clear : function()
		{
			this.graph.clear();
			this.svg.selectAll('*').remove();
		}
	};

	window.semexp = semexp;
}(window.semexp || {}));
