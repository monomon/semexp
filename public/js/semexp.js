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
	
	var request = Object.create(req);


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
			console.log(from);
			console.log(link);
			console.log(to);
			this.model.fact(from, link, to);
			this.tools.setData('fromNode', null);
			// append link to the data?
			this.refresh();
		}},

		refresh : { value : function()
		{
			this.graph.refresh(this.model.generateGraph(), this.svg, this.tools.update);
			this.tools.refresh();
		}},

		draw : { value : function()
		{
			// clean svg
			d3.selectAll('svg *').remove();
			this.graph.draw(this.model.generateGraph(), this.svg, this.tools.update, this.menu.menuData);
			this.tools.draw(this.svg);
		}},

		save : { value : function()
		{
			console.log(this.model.export());
		}},

		load : { value : function()
		{
			var explorer = this;

			req.send(null, {
				method : 'GET',
				url : 'http://localhost:3000/data'
			}).then(
			function (data) {
				explorer.model.loadData(data);
				explorer.menu.draw();
				explorer.draw();
			}, 
			function (error) {
				console.log(error);
			});
		}}
	});

	window.semexp = semexp;
}(window.semexp || {}));