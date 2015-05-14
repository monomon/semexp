(function(semexp) {
	'use strict';

	/**
	 * @var {Object} defaultData
	 * Default datum for the tools
	 */
	var defaultData = {
		fromNode : null,
		toNode : null,
		linkType : null
	};

	/**
	 * @var {Object} iconMapping
	 * mapping from icon name to image filename
	 */
	var iconMapping = {
		connect : 'relevance.svg',
		disconnect : 'cut.svg',
		document : 'document_text.svg',
		remove : 'database_remove.svg',
	};

	/**
	 * @var {String}
	 * path to the icons
	 */
	var iconPath = '../bower_components/Icons/picol_latest_prerelease_svg/';

	/**
	 * @function
	 * @param {String} key Icon name
	 * @return {String}
	 */
	function getIcon (key)
	{
		return iconPath + iconMapping[key];
	}

	/**
	 * @class
	 * graph tools
	 * these appear on nodes as circles with icons
	 * that can be interaacted with
	 *
	 */
	semexp.tools = {

		/**
		 * draw the tools
		 * @param {SVGElement} svg Base svg element
		 * @return {SVGGroup}
		 */
		draw : function(svg)
		{
			var connDrag = d3.behavior.drag();
			this.hookHandler(connDrag, 'drag');
			this.hookHandler(connDrag, 'dragstart');
			this.hookHandler(connDrag, 'dragend');
			var data = defaultData;
			var group = svg.append('g')
				.classed('tools',true)
				.datum(data)
				.style('opacity', 0);

			var circleRadius = 16;

			this.createTool(
				group,
				getIcon('connect'),
				'connect to another node',
				circleRadius
			).call(connDrag);

			this.createTool(
				group,
				getIcon('disconnect'),
				'disconnect from another node',
				circleRadius
			);

			this.createTool(
				group,
				getIcon('document'),
				'open node information',
				circleRadius
			).on('click', function (evt) {
				console.log(evt);
			});

			this.createTool(
				group,
				getIcon('remove'),
				'remove node',
				circleRadius
			);

			this.connLine = svg.append('line').attr('class','connLine');

			return group;
		},

		/**
		 * Create a single tool
		 * @param {Element} rootElement Element to append tool to
		 * @param {String} icon Icon name
		 * @param {String} label Tooltip text
		 * @param {Number} radius tool circle radius
		 */
		createTool : function(rootElement, icon, label, radius)
		{
			var g = rootElement.append('g')
				.classed('tool', true);
			g.append('title').text(label);
			g.append('circle')
				.attr('r',radius);
			g.append('svg:image')
				.attr('xlink:href', icon)
				.attr('height', radius)
				.attr('width', radius)
				.attr('x', -radius/2)
				.attr('y', -radius/2);

			return g;
		},

		/**
		 * refresh tools
		 * unset the fromNode and hide the tools
		 * This happens after interaction is complete
		 */
		refresh : function()
		{
			this.setData('fromNode', null);
			d3.select('.tools').transition().style({'opacity': 0});
		},

		/*
		 * close over event handlers with the explorer in scope
		 * @param {Element} subject Element to add handlers on
		 * @param {String} eventName
		 */
		hookHandler : function (subject, eventName)
		{
			var explorer = this.explorer;
			var eventSwitch = {
				/**
				 * drag handler function
				 * @param {Object} data stored by d3 about the node
				 * @return {Object} updated data
				 */
				drag : function (data)
				{
					var pos = d3.mouse(d3.select('svg').node());

					d3.select('.connLine')
						.attr('x2', pos[0])
						.attr('y2', pos[1]);

					var d = d3.select('.tools').datum();

					// if hovering over a node, set its datum as the toNode
					var nodeEl = d3.select(d3.event.sourceEvent.target.parentNode);
					if (nodeEl &&
						nodeEl.classed('node')) {

						if (d.toNode != nodeEl.datum()) {
							// explorer.tools.setData('toNode', d3.select(nodeEl).datum());
							data.toNode = nodeEl.datum();
							nodeEl.classed('activeTo', true);

						}
					} else {
						// explorer.tools.setData('toNode', null);
						data.toNode = null;
						d3.selectAll('.activeTo').classed('activeTo', false);
					}

					return data;
				},

				/**
				 * dragstart handler
				 */
				dragstart : function ()
				{
					d3.event.sourceEvent.stopPropagation();
					var origin = d3.mouse(d3.select('svg')[0][0]);
					var d = d3.select('.tools').datum();

					var menuData = d3.select('.controls').datum();

					// if (d && d.fromNode !== null) {
					// 	var fromNode = d.fromNode;
					// 	origin = [fromNode.x, fromNode.y];
					// }

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

				/**
				 * dragend handler
				 * @param {Object} data Data stored by d3 about the target element
				 */
				dragend : function (data)
				{
					d3.event.sourceEvent.stopPropagation();
					d3.select('.connLine').transition().style('opacity', 0);
					console.log('dropping (!)');
					d3.selectAll('.activeTo').classed('activeTo', false);

					if (data && 
						data.fromNode &&
						data.toNode &&
						data.fromNode != data.toNode &&
						data.linkType) {

						explorer.addLink(data.fromNode.name, data.linkType, data.toNode.name);
						console.log('connecting (!)');
					}

					// recover the enter listener
					explorer.graph.activateNodes();
				}
			};

			subject.on(eventName, eventSwitch[eventName]);

			return eventSwitch[eventName];
		},

		/**
		 * Obtain tools data
		 * @return {Object} datum defined on tools
		 */
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

		/**
		 * Set data on the tools datum
		 * Also update the state
		 *
		 * @param {String} key
		 * @param {Mixed}
		 */
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

		/**
		 * Obtain rect coordinates from radial
		 * FIXME: this should be moved out
		 * @param {Number} angle in radians
		 * @param {Number} radius in pixels
		 * @return {Object} containing x and y keys
		 */
		getToolPosition : function(angle, radius)
		{
			return {
				x : Math.cos(angle)*(radius),
				y : Math.sin(angle)*(radius)
			};
		},

		/**
		 * this is called from force.tick, which means at every frame
		 * be careful about the amount of updates
		 */ 
		update : function()
		{
			var tools = d3.select('.tools');
			var toolsData = tools.datum();

			if (toolsData && !!toolsData.fromNode && toolsData.fromNode.name) {

				tools.attr(
					'transform',
					'translate('+
					toolsData.fromNode.x+
					','+
					toolsData.fromNode.y+
					')'
				);

				var radius = this.explorer.graph.getRadius(toolsData.fromNode);
				var angleIncrement = 33/radius;

				// alas no custom scope in .each
				var getToolPosition = this.getToolPosition;
				tools.selectAll('.tool').each(function (data, index) {
					var angle = (index*angleIncrement)-Math.PI;
					var pos = getToolPosition(angle, radius+2);
					d3.select(this).attr(
						'transform',
						'translate('+
						pos.x+
						','+
						pos.y+
						')'
					);
				});


				tools.transition().style('opacity', 1);
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

	return semexp;
}(window.semexp || {}));
