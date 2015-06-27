(function (semexp) {
	var db = new Semnet();

	/**
	 * @class
	 * Uses an internal {@link https://github.com/asciimoo/semnet|semnet} and provides an interface to it.
	 * Also able to export the semantic network to an object
	 */
	semexp.model = {
		filterData : {
			relations : undefined,
			entities : undefined
		},

		defaultRelation : undefined,
		defaultFact : undefined,

		updateFilterData : function(data)
		{
			for (var key in data) {
				this.filterData[key] = data[key];
			}

			this.explorer.refresh();
		},

		getFilterData : function()
		{
			return this.filterData;
		},

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

			var filterData = this.getFilterData();
			if (filterData.entities) {
				filterData.entities.forEach(function (item) {
					if (item.length < 2) {
						return;
					}

					nodeEntities = nodeEntities.filter(
						item[0].value,
						item[1].value
					);

					// add node that filtered nodes are related to
					// this might make the graph look better...
					// think about it
					// nodes.push({
					// 	name : item[1].value,
					// 	relations : 0
					// });
				});
			}

			nodeEntities = nodeEntities.all();
			var relations = this.getRelations();

			// build up graph data - translate from database
			nodes = nodeEntities.reduce(function(prev, curr) {
				// ignore relations
				if (curr && !relations[curr]) {
					prev.push({
						name : curr,
						relations : 0
					});
				}
				return prev;
			}, nodes);

			// go through all relations, add links for each
			// go through each pair of nodes
			if (filterData.relations && filterData.relations.length > 0) {
				var oldRelations = relations;
				relations = {};
				filterData.relations.forEach(function (item) {
					relations[item[0].value] = oldRelations[item[0].value];
				});
			}

			/**
			 * Create a node with its corresponding links
			 * filtered by having a certain relation defined.
			 * Uses some variables directly available in the scope...
			 * @param {Object} node
			 */
			function updateLinks(node)
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
					// add related nodes to make the graph better
					item.relations = Object.keys(db.entities[item.name]).length || 0;
					links.push({
						source : item,
						target : node,
						name : relationName
					});
				});
			}

			for (var relationName in relations) {
				nodes.forEach(updateLinks);
			}

			return {
				nodes : nodes,
				links : links
			};
		},

		/**
		 * Export database to a serializable object
		 * @return {Object}
		 */
		export : function()
		{
			return db.export();
		},

		/**
		 * Obtain all relations in the db
		 * The relations object, as defined by semnet
		 * @return {Object} relations
		 */
		getRelations : function()
		{
			return db.relations;
		},

		/**
		 * filter out relations; this might not be the best way
		 * define what is a relation in the semantic network itself?
		 * @return {Array} entities that are not relations (this is still a bit flaky)
		 */
		getEntities : function()
		{
			var relationKeys = Object.keys(this.getRelations());
			return db.q().all().filter(function (item) {
				return relationKeys.indexOf(item) < 0;
			});
		},

		/**
		 * simple wrapper around semnet.add
		 * @param {String} nodeName
		 * @param {Object} options Additional options, normally used for relations
		 */
		add : function(nodeName, options)
		{
			db.add(nodeName, options);
		},

		/**
		 * Add a fact to the database
		 * @param {String} from Source object id
		 * @param {String} relation Relation id
		 * @param {String} to Target object id
		 */
		fact : function(from, relation, to)
		{
			db.fact(from, relation, to);
		}
	};

	return semexp;
}(window.semexp || {}));
