(function (semexp) {
	'use strict';
	semexp.graph = {
		// radius calc function - depends on number of relations
		// make this configurable somehow...
		getRadius : function(d)
		{
			return Math.round(Math.log(d.relations+1)*20 + 25);
		},

		drawNodes : function(nodes, svg, dragFunc)
		{
			var node = this.layers.nodes.selectAll('.node').data(nodes);
			
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

		drawLinks : function(links, svg)
		{
			var link = this.layers.links.selectAll('.link')
				.data(links);

			link.enter()
				.append('line')
				.classed('link', true);

			link.exit().remove();

			// return update selection
			return link;
		},

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

		draw : function(db, svg, tickComponents)
		{
			this.force = d3.layout.force()
				.linkStrength(0.8)
				.distance(150)
				.friction(0.9)
				.charge(-250)
				.gravity(0.05)
				.theta(0.8)
				.alpha(0.5)
				.size([svg.property('width').baseVal.value, svg.property('height').baseVal.value]);


			this.layers = {
				links : svg.append('g').classed('links', true),
				nodes : svg.append('g').classed('nodes', true)
			};

			this.refresh(db, svg, tickComponents);
		},

		// todo: find out how to add nodes and links wihtout rebinding to force, etc.
		refresh : function(graph, svg, tickComponents)
		{
			var link = this.drawLinks(graph.links, svg);
			var node = this.drawNodes(graph.nodes, svg, this.force.drag);

			this.force
				.links(graph.links)
				.nodes(graph.nodes)
				.start();
			// update links and nodes with force
			this.force.on('tick', function () {
				link.attr('x1', function(d) { return d.source.x; })
					.attr('y1', function(d) { return d.source.y; })
					.attr('x2', function(d) { return d.target.x; })
					.attr('y2', function(d) { return d.target.y; });

				node.attr('transform', function(d) {
					return ('translate('+d.x+','+d.y+')');
				});

				tickComponents.forEach(function (item) {
					item.update.call(item);
				});
			});
		},

		paralyzeNodes : function()
		{
			d3.selectAll('.node')
				.on('mouseenter', null)
				.on('mouseout', null);
		},

		activateNodes : function()
		{
			this.hookHandler(d3.selectAll('.node'), 'mouseenter');
			this.hookHandler(d3.selectAll('.node'), 'mouseout');
		}
	};

	window.semexp = semexp;

}(window.semexp || {}));