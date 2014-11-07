(function(semexp) {
	'use strict';

	var defaultData = {
		defaultFactRelation : 'is',
		defaultFactEntity : 'mp',
		defaultRelation : 'knows',
		filterFactRelation : 'is',
		filterFactEntity : 'mp',
		filterRelation : 'knows'
	};

	semexp.menu = {
		draw : function ()
		{
			var explorer = this.explorer;
			var menuEl = d3.select('body')
				.append('form')
				.classed('controls', true)
				.on('submit', function() {
					if (d3.event) d3.event.preventDefault();

					var value = menuEl.select('input[type=text]').property('value');
					if (!value || value === '') {
						return false;
					}

					console.log(value);

					explorer.addNode(value);
					menuEl.select('input[type=text]').property('value', '');
				});

			// fixme: automate this stuff a little more
			var elType = 'div';

			var nameControls = menuEl.append(elType);
			nameControls.append('label').text('node name');
			nameControls.append('input')
				.attr('type','text')
				.attr('name', 'name')
				.attr('emptytext', 'name');
			nameControls.append('input')
				.attr('type','submit')
				.property('value', 'add node');

			this.createFactSelector(
				menuEl.append(elType),
				'default',
				'default fact',
				function () {
					explorer.refresh();
				}
			);

			this.createRelationSelector(
				menuEl.append(elType),
				'default',
				'default relation',
				function () {
					explorer.refresh();
				}
			);

			this.createFactSelector(
				menuEl.append(elType),
				'filter',
				'filter fact',
				function () {
					explorer.refresh();
				}
			);

			this.createRelationSelector(
				menuEl.append(elType),
				'filter',
				'relation type',
				function () {
					explorer.refresh();
				}
			);

			var buttonGroup = menuEl.append(elType);
			buttonGroup.append('input')
				.attr('type', 'button')
				.property('value', 'save')
				.on('click', function () {
					explorer.save.call(explorer);
				});

			buttonGroup.append(elType)
				.append('input')
				.attr('type', 'button')
				.property('value', 'load')
				.on('click', function () {
					console.log(this);
				});

			var menuData = defaultData;
			menuEl.datum(menuData);
			this.applyData(menuData);

			return menuEl;
		},

		createFactSelector : function(rootElement, basename, label, buttonCallback)
		{
			var explorer = this.explorer;

			rootElement.append('label').text(label);
			rootElement.append('select')
				.attr('name', basename + 'FactRelation')
				.on('change', this.updateData)
				.selectAll('option')
				.data(explorer.model.getRelations())
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});
			rootElement.append('select')
				.attr('name', basename + 'FactEntity')
				.on('change', this.updateData)
				.selectAll('option')
				.data(explorer.model.getEntities())
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});
			rootElement.append('input')
				.property('value', 'apply')
				.property('type', 'button')
				.on('click', buttonCallback);

			return rootElement;
		},

		createRelationSelector : function(rootElement, basename, label, changeCallback)
		{
			var explorer = this.explorer;

			rootElement.append('label').text(label);
			rootElement.append('select')
				.attr('name', basename + 'Relation')
				.on('change', this.updateData)
				.selectAll('option')
				.data(explorer.model.getRelations())
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			return rootElement;
		},

		// update data from a change event
		updateData : function ()
		{
			var d = d3.select('.controls').datum();
			d[this.name] = this.value;
			d3.select('.controls').datum(d);
		},

		applyData : function (data)
		{
			var rootElement = d3.select('.controls');
			for (var key in data) {
				var el = rootElement.select('[name=' + key + ']');
				el.property('value', data[key]);
			}
		},

		getData : function (key)
		{
			if (key) {
				return d3.select('.controls').datum()[key];
			} else {
				return d3.select('.controls').datum();
			}
		}
	};

	window.semexp = semexp;

	return semexp;
}(window.semexp || {}));