(function(semexp) {
	'use strict';

	var defaultData = {
		defaultFactRelation : 'is',
		defaultFactEntity : 'mp',
		relationType : 'knows'
	};

	semexp.menuProto = {
		draw : function ()
		{
			var explorer = this.explorer;
			var menu = d3.select('body')
				.append('form')
				.classed('controls', true)
				.on('submit', function() {
					if (d3.event) d3.event.preventDefault();

					var value = menu.select('input[type=text]').property('value');
					if (!value || value === '') {
						return false;
					}

					console.log(value);

					explorer.addNode(value);
					menu.select('input[type=text]').property('value', '');
				});

			var menuList = menu.append('ul');

			var nameControls = menuList.append('li');
			nameControls.append('label').text('node name');
			nameControls.append('input')
				.attr('type','text')
				.attr('name', 'name')
				.attr('emptytext', 'name');
			nameControls.append('input')
				.attr('type','submit')
				.property('value', 'add node');

			var defaultRelControls = menuList.append('li');
			defaultRelControls.append('label').text('default relation');
			defaultRelControls.append('select')
				.attr('name', 'defaultFactRelation')
				.on('change', this.updateData)
				.selectAll('option')
				.data(explorer.getRelations())
				.enter()
				.append('option')
				.property('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});
			defaultRelControls.append('select')
				.attr('name', 'defaultFactEntity')
				.on('change', this.updateData)
				.selectAll('option')
				.data(explorer.getEntities())
				.enter()
				.append('option')
				.property('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});


			var typeControls = menuList.append('li');
			typeControls.append('label').text('relation name');
			typeControls.append('select')
				.attr('name', 'relationType')
				.attr('size', 2)
				.on('change', this.updateData)
				.selectAll('option')
				.data(explorer.getRelations())
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			var menuData = defaultData;
			menu.datum(menuData);

			// set default values in filter - this should come from config?
			defaultRelControls.select('select[name=defaultFactRelation]').property('value', menuData.defaultFactRelation);
			defaultRelControls.select('select[name=defaultFactEntity]').property('value', menuData.defaultFactEntity);
			typeControls.select('select').property('value', 'knows');

			return menu;
		},

		// update data from a change event
		updateData : function ()
		{
			var d = d3.select('.controls').datum();
			d[this.name] = this.value;
			d3.select('.controls').datum(d);
		},

		getData : function (key)
		{
			if (key) {
				return d3.select('.controls').datum()[key];
			} else {
				return d3.select('.controls').datum();
			}
		},

		refresh : function ()
		{

		}
	};

	window.semexp = semexp;

	return semexp;
}(window.semexp || {}));