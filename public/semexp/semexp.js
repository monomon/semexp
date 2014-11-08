/*
Semantic explorer
an experiment in navigating semantic networks

* display a semantic network in a graph (force-directed layout)
* allow arbitrary filters on the data - select from a menu
* filter nodes and then links?
* add tools for manipulating the data, e.g.:
	* add node - enter node details, name at a minimum
	* add link - perhaps choose from a dropdown with limited options, e.g. relations that have already been defined in the model
	* modify node
* extend the database class:
	* be able to add more data on a node (might be possible already?), e.g. an object or map
	* implement loading and saving directly inside the semnet class; push changes upstream

*/

(function(semexp) {
	'use strict';
	
	Object.defineProperties(semexp, {
		init : { value : function(config)
		{
			this.graph = Object.create(semexp.graph, {
				explorer : { value : this }
			});
			this.tools = Object.create(semexp.tools, {
				explorer : { value : this }
			});
			this.menu = Object.create(semexp.menu, {
				explorer : { value : this }
			});

			this.model = Object.create(semexp.model, {
				explorer : { value : this }
			});


			var body = d3.select('body');
			this.svg = d3.select('body').append('svg')
				.attr('width', body.property('clientWidth'))
				.attr('height', body.property('clientHeight'));
		}},

		addNode : { value : function(nodeName)
		{
			this.model.add(nodeName);
			var menuData = this.menu.getData();
			// add default fact
			if (menuData.defaultFactRelation && menuData.defaultFactEntity) {
				this.model.fact(nodeName, menuData.defaultFactRelation, menuData.defaultFactEntity);
			}
			this.tools.setData('fromNode', null);
			this.refresh();
		}},

		addLink : { value : function(from, link, to)
		{
			if (from == to) {
				return;
			}

			console.log(from);
			console.log(link);
			console.log(to);
			this.model.fact(from, link, to);
			this.tools.setData('fromNode', null);
			// append link to the data?
			this.refresh();
		}},

		removeNode : { value : function(nodeName)
		{
			console.log(nodeName);
		}},

		refresh : { value : function()
		{
			// this hooks the tick handler; perhaps move elsewhere
			this.graph.refresh(this.model.generateGraph(), [this.tools]);
			this.tools.refresh();
			this.menu.refresh();
		}},

		draw : { value : function()
		{
			// clean svg
			this.svg.selectAll('*').remove();
			this.graph.draw(
				this.model.generateGraph(),
				this.svg,
				[this.tools],
				this.menu.getData());
			this.tools.draw(this.svg);
		}},

		save : { value : function()
		{
			console.log(this.model.export());
		}},

		load : { value : function(data)
		{
			this.model.loadData(data);
			this.menu.draw();
			this.draw();
		}}
	});

	window.semexp = semexp;
}(window.semexp || {}));