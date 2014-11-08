(function (semexp) {
	var db = new Semnet();

	semexp.model = {
		// load data into semantic model
		loadData : function(data)
		{
			if (!data) {
				console.log('no data passed');
				return;
			}

			db.import(data);
			// db.add('isA', { transitive : false, opposite : 'classOf'});
			db.add('animal');
			db.add('dinosaurus');
			db.fact('dinosaurus', 'is', 'animal');
			db.add('stegosaurus');
			db.fact('stegosaurus', 'is', 'dinosaurus');
		},

		// translate from semantic network to a graph for the layout algorithm
		// @todo: make this use custom filters for nodes and links
		// pass them as arguments
		generateGraph : function ()
		{
			var nodes = [];
			var links = [];
			var nodeEntities = db.q();

			var menuData = this.explorer.menu.getData();
			if (menuData.filterFactRelation &&
				menuData.filterFactEntity &&
				menuData.filterFactToggle === true) {

				nodeEntities = nodeEntities.filter(
					menuData.filterFactRelation,
					menuData.filterFactEntity
				);
			}

			nodeEntities = nodeEntities.all();
			var relations = this.getRelations();

			// build up graph data - translate from database
			nodes = nodeEntities.reduce(function(prev, curr) {
				if (curr && !relations[curr]) {
					prev.push({
						name : curr,
						relations : 0
					});
				}
				return prev;
			}, []);

			// go through all relations, add links for each
			// go through each pair of nodes
			if (menuData.filterFactToggle === true &&
				menuData.filterRelation) {
				oldRelations = relations;
				relations = {};
				relations[menuData.filterRelation] = oldRelations[menuData.filterRelation];
			}

			for (var relationName in relations) {
				console.log(relationName);
				nodes.forEach(function (node) {
					var result = db.q();
					result = result.filter(relationName, node.name);
					result = result.all();

					var relatedNodes = nodes.filter(function (item) {
						// item is in filtered list and has this relation
						return (result.indexOf(item.name) >= 0) &&
						db.entities[item.name][relationName] &&
						(nodeEntities.indexOf(item.name) >= 0);
					});
					relatedNodes.forEach(function (item) {
						item.relations = db.entities[item.name][relationName].length || 0;
						links.push({
							source : item,
							target : node,
							name : relationName
						});
					});
				});
			}
			
			return {
				nodes : nodes,
				links : links
			};
		},

		export : function()
		{
			return db.export();
		},

		getRelations : function()
		{
			return db.relations;
		},

		// filter out relations; this might not be the best way
		// define what is a relation in the semantic network itself?
		getEntities : function()
		{
			var relationKeys = Object.keys(this.getRelations());
			return db.q().all().filter(function (item) {
				return relationKeys.indexOf(item) < 0;
			});
		},

		// some simple wrapper functions
		add : function(nodeName)
		{
			db.add(nodeName);
		},

		fact : function(from, relation, to)
		{
			db.fact(from, relation, to);
		}
	};

	return semexp;
}(window.semexp || {}));