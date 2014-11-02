/*
Semantic explorer
an experiment in navigating semantic networks

* display a semantic network in a graph (force-directed layout)
* allow arbitrary filters on the data - select from a menu
* filter nodes and then links?
* add tools for manipulating the data, e.g.:
	* add node - enter node details, name at a minimum
	* add link - perhaps choose from a dropdown with limited options, e.g. relations that have already been defined in the db
	* modify node
* extend the database class:
	* be able to add more data on a node (might be possible already?), e.g. an object or map
	* implement loading and saving directly inside the semnet class; push changes upstream

*/

(function(semexp) {
	'use strict';

	var db = new Semnet();

	Object.defineProperties(semexp, {
		init : { value : function(config)
		{
			this.graph = Object.create(semexp.graphProto, {
				explorer : { value : this }
			});
			this.tools = Object.create(semexp.toolsProto, {
				explorer : { value : this }
			});
			this.menu = Object.create(semexp.menuProto, {
				explorer : { value : this }
			});

			this.svg = d3.select('body').append('svg')
				.attr('width', config.width)
				.attr('height', config.height);
		}},

		loadData : { value : function(data)
		{
			if (!data) {
				console.log('no data passed');
				return;
			}
			// create some default relations
			db.add('knows', { transitive : false, opposite : 'knows' });
			db.add('mp');

			// this seems to work though not very pretty
			// todo: serialization and deserialization in semnet class?
			for (var relation in data.relations) {
				db.add(data.relations[relation]);
			}
			for (var entity in data.entities) {
				db.add(entity);
				var relations = Object.keys(db.relations).filter(function (relation) {
					console.log(entity);
					console.log(data.entities[entity][relation]);
					return data.entities[entity].hasOwnProperty(relation);
				});
				relations.forEach(function (relation) {
					data.entities[entity][relation].forEach(function(relatedEntity) {

						db.fact(entity, relation, relatedEntity);
					});
				});
			}
			// console.log(db.relations);
			// console.log(db.entities);
			// db.entities = data.entities;
			// db.relations = data.relations;

		}},

		addNode : { value : function(nodeName)
		{
			db.add(nodeName);
			var menuData = this.menu.getData();
			if (menuData.defaultFactRelation && menuData.defaultFactEntity) {
				db.fact(nodeName, menuData.defaultFactRelation, menuData.defaultFactEntity);
			}
			this.refresh();
		}},

		addLink : { value : function(from, link, to)
		{
			console.log(from);
			console.log(link);
			console.log(to);
			db.fact(from, link, to);
			// append link to the data?
			this.refresh();
		}},

		getRelations : { value : function()
		{
			return Object.keys(db.relations);
		}},

		getEntities : { value : function()
		{
			var relations = this.getRelations();
			return Object.keys(db.entities).filter(function (item) {
				return relations.indexOf(item) < 0;
			});
		}},

		refresh : { value : function()
		{
			this.graph.refresh(db, this.svg, this.tools.update);
			this.tools.refresh();
			this.menu.refresh();
		}},

		draw : { value : function()
		{
			// clean svg
			d3.selectAll('svg *').remove();
			this.graph.draw(db, this.svg, this.tools.update);
			this.tools.draw(this.svg);
			this.menu.draw();
		}}
	});

	window.semexp = semexp;
}(window.semexp || {}));