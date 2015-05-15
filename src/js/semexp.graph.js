(function (semexp) {
	'use strict';

	/**
	 * @class semexp.graph
	 * Draw a force-directed graph of a structure passed to draw
	 */
	semexp.graph = {

		radiusBase : 35,
		radiusMultiplier : 8,

		layoutProps : {
			linkStrength : 0.6,
			distance : 200,
			friction : 0.9,
			charge : -300,
			gravity : 0.03,
			theta : 0.9,
			alpha : 0.7
		},

		/**
		 * radius calc function - depends on number of relations
		 * @todo: make this configurable
		 * @param {Object} d Data object for which to calculate the radius
		 * @return {Number} radius
		 */
		getRadius : function(d)
		{
			return Math.round(Math.log(d.relations+1)*semexp.graph.radiusMultiplier + semexp.graph.radiusBase);
		},

		/**
		 * Draw the graph nodes
		 * @todo resize text based on the circle radius so it fits
		 * @param {Array} nodes The node data for all nodes
		 * @param {SVGGroup} layer The layer to append the node to
		 * @param {Function} dragFunc 
		 * @return {d3.selection} {@link https://github.com/mbostock/d3/wiki/Selections#d3_selectAll|d3 update selection}
		 */
		drawNodes : function(nodes, layer, dragFunc)
		{
			layer.selectAll('.node').remove();
			var node = layer.selectAll('.node').data(nodes);
			
			var group = node.enter()
				.append('g')
				.call(dragFunc)
				.classed('node', true);

			group.append('circle')
				.attr('r', this.getRadius);

			group.append('text')
				.text(function(d) { return d.name; })
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'central');

			group.append('title')
			  .text(function(d) { return d.name; });

			node.select('circle')
				.attr('r', this.getRadius);

			node.exit().remove();

			this.hookHandler(node, 'mouseenter');
			this.hookHandler(node, 'mouseleave');

			// return update selection
			return node;
		},

		/**
		 * Draw all links in the graph
		 * @param {Array} links Data for all links
		 * @param {SVGGroup} layer The svg element to append to
		 * @return {d3.selection} update selection
		 */
		drawLinks : function(links, layer)
		{
			layer.selectAll('.link').remove();
			var link = layer.selectAll('.link').data(links);

			var g = link.enter()
				.append('g')
				.classed('link', true);

			g.append('line')
				.attr('marker-end', 'url(#Triangle)');
			var label = g.append('g')
				.classed('label', true);

			var text = label
				.append('text')
				.text(function (d) {
					return d.name;
				})
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'central');

			if (text.node()) {
				// add background box
				var bbox = text.node().getBBox();
				var padding = 10;
				label.insert('rect', 'text')
					.attr('width',bbox.width+padding)
					.attr('height', bbox.height+padding)
					.attr('x',-(bbox.width+padding)*0.5)
					.attr('y',-(bbox.height+padding)*0.5-5)
					.attr('rx', 8)
					.attr('ry', 8);
			}

			link.exit().remove();

			// return update selection
			return link;
		},

		/**
		 * Connect all event listeners for nodes.
		 * These include drag'n'drop, etc.
		 * @param {Element} subject Element to add listener to
		 * @param {String} eventName
		 * @return {}
		 */
		hookHandler : function(subject, eventName)
		{
			var explorer = this.explorer;
			var eventSwitch = {
				mouseenter : function (dat)
				{
					d3.event.preventDefault();

					// clear active classes
					d3.selectAll('.node')
						.classed('active', false);

					explorer.tools.setData('fromNode', dat);

					this.classList.add('active');

				},
				mouseout : function ()
				{
					// 	// .datum({'fromNode' : undefined})
					// 	.transition().style('opacity', 0);
				}
			};

			return subject.on(eventName, eventSwitch[eventName]);
		},

		/**
		 * Draw the graph in a force directed layout
		 * @param {Object} graph object, consisting of nodes and links
		 * @param {SVGElement} svg Base svg element
		 * @param {Array} tickComponents Entities that need to be updated on every tick; they have an update method
		 */
		draw : function(graph, svg, tickComponents)
		{
			this.force = d3.layout.force()
				.linkStrength(this.layoutProps.linkStrength)
				.distance(this.layoutProps.distance)
				.friction(this.layoutProps.friction)
				.charge(this.layoutProps.charge)
				.gravity(this.layoutProps.gravity)
				.theta(this.layoutProps.theta)
				.alpha(this.layoutProps.alpha)
				.size([svg.property('width').baseVal.value, svg.property('height').baseVal.value]);

			var defs = svg.append('defs');
			defs.append('marker')
				.attr('id', 'Triangle')
				.attr('orient', 'auto')
				.attr('refX', 7)
				.attr('refY', 2)
				.attr('markerUnits', 'strokeWidth')
				.attr('markerWidth', 10)
				.attr('markerHeight', 10)
				.append('path')
				.attr('fill', '#999933')
				.attr('d', 'M 0 0 L 3 2 L 0 4 z');

			this.layers = {
				links : svg.append('g').classed('links', true),
				nodes : svg.append('g').classed('nodes', true)
			};

			this.refresh(graph, tickComponents);
		},

		/**
		 * Refresh the graph
		 * @todo: find out how to add nodes and links wihtout rebinding to force, etc.
		 * @param {Object} graph object, consisting of nodes and links
		 * @param {SVGElement} svg Base svg element
		 * @param {Array} tickComponents Entities that need to be updated on every 
		 */
		refresh : function(graph, tickComponents)
		{
			var link = this.drawLinks(graph.links, this.layers.links);
			var node = this.drawNodes(graph.nodes, this.layers.nodes, this.force.drag);
			this.force
				.links(graph.links)
				.nodes(graph.nodes)
				.start();

			// update links and nodes with force
			this.force.on('tick', function () {
				link.select('line')
					.attr('x1', function (d) { return d.source.x; })
					.attr('y1', function (d) { return d.source.y; })
					.attr('x2', function (d) { return d.target.x; })
					.attr('y2', function (d) { return d.target.y; });

				link.select('.label')
					.attr('transform', function(d) {
						return 'translate('+
						(d.source.x+d.target.x)/2+
						','+
						(d.source.y+d.target.y)/2+
						')';
					 });
				node.attr('transform', function(d) {
					return ('translate('+d.x+','+d.y+')');
				});

				// components registered and they have an udpate method
				tickComponents.forEach(function (item) {
					item.update.call(item);
				});
			});
		},

		/**
		 * Prevent interaction with the nodes by removing their event listeners
		 */
		paralyzeNodes : function()
		{
			d3.selectAll('.node')
				.on('mouseenter', null)
				.on('mouseout', null);
		},

		/**
		 * Attach event listeners for nodes
		 */
		activateNodes : function()
		{
			this.hookHandler(d3.selectAll('.node'), 'mouseenter');
			this.hookHandler(d3.selectAll('.node'), 'mouseout');
		},

		/**
		 * Clear the graph
		 */
		clear : function()
		{
			this.layers.nodes.remove();
			this.layers.links.remove();			
		}
	};

	return semexp;
}(window.semexp || {}));
