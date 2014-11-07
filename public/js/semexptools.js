(function(semexp) {
	'use strict';
	var defaultData = {
		fromNode : null,
		toNode : null,
		linkType : null
	};

	semexp.tools = {
		init : function()
		{

		},

		draw : function(svg)
		{
			var drag = d3.behavior.drag();
			this.hookHandler(drag, 'drag');
			this.hookHandler(drag, 'dragstart');
			this.hookHandler(drag, 'dragend');
			var data = defaultData;
			var group = svg.append('g')
				.classed('tools',true)
				.datum(data)
				.call(drag)
				.style('opacity', 0);
			group.append('circle')
				.attr('r',10);

			this.connLine = svg.append('line').attr('class','connLine');

			return group;
		},

		refresh : function(svg)
		{
			d3.select('.tools').transition().style('opacity', 0);
		},

		/*
		 * close over event handlers with the explorer in scope
		 */
		hookHandler : function (subject, eventName)
		{
			var explorer = this.explorer;
			var eventSwitch = {
				drag : function (evt)
				{
					d3.select('.connLine')
						.attr('x2', d3.event.x)
						.attr('y2', d3.event.y);

					var node;

					var d = d3.select(this).datum();

					// if hovering over a node, set its datum as the toNode
					var nodeEl = d3.event.sourceEvent.target.parentNode;
					if (nodeEl &&
						nodeEl.classList.contains('node')) {
						if (d.toNode != d3.select(nodeEl).datum()) {
							explorer.tools.setData('toNode', d3.select(nodeEl).datum());
						}
					} else {
						explorer.tools.setData('toNode', null);
					}
				},

				dragstart : function ()
				{
					d3.event.sourceEvent.stopPropagation();
					var origin = d3.mouse(d3.select('svg')[0][0]);
					var d = d3.select('.tools').datum();

					var menuData = d3.select('.controls').datum();

					if (d && d.fromNode !== null) {
						var fromNode = d.fromNode;
						origin = [fromNode.x, fromNode.y];
					}

					if (menuData && menuData.defaultRelation) {
						d.linkType = menuData.defaultRelation;
					}

					// place both points at the center for consistency
					// otherwise might get weird jumps
					d3.select('.connLine')
						.attr('x1', origin[0])
						.attr('y1', origin[1])
						.attr('x2', origin[0])
						.attr('y2', origin[1]);
					d3.select('.connLine').transition().style('opacity', 1);

					// remove the enter listener to prevent fromNode being set
					// this could be made better...
					explorer.graph.paralyzeNodes();
				},
				dragend : function (toolsData)
				{
					d3.event.sourceEvent.stopPropagation();
					d3.select('.connLine').transition().style('opacity', 0);
					console.log('dropping (!)');

					if (toolsData && 
						toolsData.fromNode &&
						toolsData.toNode &&
						toolsData.fromNode != toolsData.toNode &&
						toolsData.linkType) {

						explorer.addLink(toolsData.fromNode.name, toolsData.linkType, toolsData.toNode.name);
						console.log('connecting (!)');
					}

					// recover the enter listener
					explorer.graph.activateNodes();
				}
			};

			subject.on(eventName, eventSwitch[eventName]);

			return eventSwitch[eventName];
		},

		getData : function()
		{
			var dat = null;
			var tools = d3.select('.tools');
			if (!tools || tools.node() === null || tools.datum() === undefined) {
				dat = defaultData;
			}

			tools.datum(dat);
			return dat;
		},

		setData : function(key, value)
		{
			var tools = d3.select('.tools');
			// console.log('setting ' + key + ' to value ' + JSON.stringify(value));
			var d = tools.datum();
			if (!d || d === null) {
				d = defaultData;
			}
			d[key] = value;
			tools.datum(d);

			this.update();
		},

		// this is called from force.tick, which means at every frame
		// be careful about the amount of updates
		// 
		update : function()
		{

			var tools = d3.select('.tools');
			var toolsData = tools.datum();
			if (toolsData && !!toolsData.fromNode && toolsData.fromNode.name) {
				tools.attr(
					'transform',
					'translate('+
					(toolsData.fromNode.x - Math.round(Math.log(toolsData.fromNode.relations+1)*15 + 25))+
					','+
					toolsData.fromNode.y+
					')'
				)
				.transition().style('opacity', 1);
			} else {
				tools.style('opacity',0);
			}

			if (toolsData &&
				toolsData.fromNode !== null &&
				toolsData.name &&
				toolsData.toNode !== null &&
				toolsData.toNode.name) {
				this.connLine
					.attr('visiblity', (toolsData.fromNode ? 'visible' : 'hidden'))
					.attr('x1', toolsData.fromNode.x)
					.attr('y1', toolsData.fromNode.y)
					.attr('x2', toolsData.toNode.x)
					.attr('y2', toolsData.toNode.y);
			}
		}
	};
	window.semexp = semexp;

	return semexp;
}(window.semexp || {}));