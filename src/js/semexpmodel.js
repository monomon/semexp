(function (semexp) {
	var db = new Semnet();

	/**
	 * @class semexp.model
	 */
	semexp.model = {
		/**
		 * load data into semantic model
		 * @param {Object} data
		 */
		loadData : function(data)
		{
			if (!data) {
				console.log('no data passed');
				return;
			}

			db.import(data);
		},

		/**
		 * translate from semantic network to a graph object for the layout algorithm
		 * @todo: make this use custom filters for nodes and links
		 * pass them as arguments
		 * @return {Object} a graph representation with nodes and links
		 */
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
			if (menuData.filterRelationToggle === true &&
				menuData.filterRelation) {
				var oldRelations = relations;
				relations = {};
				relations[menuData.filterRelation] = oldRelations[menuData.filterRelation];
			}

			/**
			 * create a node with its corresponding links
			 */
			function createNode(node)
			{
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
			}

			for (var relationName in relations) {
				nodes.forEach(createNode);
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
		add : function(nodeName, options)
		{
			db.add(nodeName, options);
		},

		fact : function(from, relation, to)
		{
			db.fact(from, relation, to);
		}
	};

	return semexp;
}(window.semexp || {}));
