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
			console.log(data);
			db.import(data);

			console.log(JSON.stringify(db.export(data)));
		},

		// translate from semantic network to a graph for the layout algorithm
		// @todo: make this use custom filters for nodes and links
		generateGraph : function ()
		{
			var nodes = [];
			var links = [];
			var mps;

			var menuData = this.explorer.menu.getData();
			if (menuData.filterFactRelation && menuData.filterFactEntity) {
				mps	= db.q().filter(
					menuData.filterFactRelation,
					menuData.filterFactEntity
				).all();
			}

			// build up graph data - translate from database
			nodes = mps.map(function(item) {
				return {
					name : item,
					relations : 0
				};
			});
			
			// links between nodes with a certain relation - make this configurable
			for (var i = nodes.length - 1; i >= 0; i--) {
				var knows = db.q().filter(menuData.filterRelation, nodes[i].name).all();
				// get all other nodes that are related to current node
				var knowNodes = nodes.filter(function(item){
					return knows.indexOf(item.name) >= 0;
				});

				for (var j = knowNodes.length - 1; j>= 0; j--) {
					nodes[i].relations++;
					links.push({
						source : nodes[i],
						target : knowNodes[j]
					});
				}
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
			return Object.keys(db.relations);
		},

		// filter out relations; this might not be the best way
		// define what is a relation in the semantic network itself?
		getEntities : function()
		{
			var relations = this.getRelations();
			return Object.keys(db.entities).filter(function (item) {
				return relations.indexOf(item) < 0;
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